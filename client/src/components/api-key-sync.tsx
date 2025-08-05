import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Key, Info } from "lucide-react";
import { getSpreadsheetIdFromUrl } from "@/lib/google-sheets";

interface ApiKeySyncProps {
  onDataLoaded: (data: any[]) => void;
  isLoading: boolean;
}

export function ApiKeySync({ onDataLoaded, isLoading }: ApiKeySyncProps) {
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSyncSheets = async () => {
    try {
      const spreadsheetId = getSpreadsheetIdFromUrl(spreadsheetUrl) || spreadsheetUrl;
      
      if (!spreadsheetId || !apiKey) {
        toast({
          title: "Missing Information",
          description: "Please provide both the Google Sheets URL/ID and API key",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('/api/sync-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spreadsheetId, apiKey }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sync Google Sheets');
      }

      const result = await response.json();
      
      // The API already stores the data, so we just need to trigger a refresh
      onDataLoaded([]);
      
      toast({
        title: "Success",
        description: `Synced ${result.count} team members from Google Sheets`,
      });

    } catch (error: any) {
      console.error('Error syncing Google Sheets:', error);
      
      let errorMessage = "Failed to sync data from Google Sheets";
      
      if (error.message.includes('API error')) {
        errorMessage = "Invalid API key or insufficient permissions. Please check your Google Sheets API key.";
      } else if (error.message.includes('not found')) {
        errorMessage = "Spreadsheet not found. Please check the URL/ID and make sure the sheet is publicly accessible.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-3 mb-4">
          <Key className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              API Key Method
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use your Google Sheets API key and spreadsheet URL to load data directly.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="spreadsheet-url">Google Sheets URL or Spreadsheet ID</Label>
            <Input
              id="spreadsheet-url"
              placeholder="https://docs.google.com/spreadsheets/d/... or spreadsheet ID"
              value={spreadsheetUrl}
              onChange={(e) => setSpreadsheetUrl(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="api-key">Google Sheets API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Your Google Sheets API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <Button 
            onClick={handleSyncSheets} 
            disabled={isLoading || !spreadsheetUrl.trim() || !apiKey.trim()}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Sync with API Key
              </>
            )}
          </Button>
        </div>

        <Separator className="my-6" />

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800 mb-2">
                API Key Requirements
              </h4>
              <div className="text-sm text-amber-700 space-y-1">
                <p>For this method to work:</p>
                <ul className="ml-4 list-disc space-y-1 mt-2">
                  <li>Your Google Sheet must be <strong>publicly viewable</strong> or shared with "Anyone with the link"</li>
                  <li>Your API key must have access to the Google Sheets API</li>
                  <li>The sheet should have a "Schedule" tab with the required column format</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}