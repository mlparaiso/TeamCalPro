import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, FileSpreadsheet, Info } from "lucide-react";
import { googleAuthService } from "@/lib/google-auth";
import { getSpreadsheetIdFromUrl } from "@/lib/google-sheets";

interface SpreadsheetSelectorProps {
  onDataLoaded: (data: any[]) => void;
  isLoading: boolean;
}

export function SpreadsheetSelector({ onDataLoaded, isLoading }: SpreadsheetSelectorProps) {
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const { toast } = useToast();

  const handleLoadData = async () => {
    try {
      if (!googleAuthService.isUserSignedIn()) {
        toast({
          title: "Authentication Required",
          description: "Please sign in with Google first",
          variant: "destructive",
        });
        return;
      }

      const spreadsheetId = getSpreadsheetIdFromUrl(spreadsheetUrl) || spreadsheetUrl;
      
      if (!spreadsheetId) {
        toast({
          title: "Invalid URL",
          description: "Please provide a valid Google Sheets URL or spreadsheet ID",
          variant: "destructive",
        });
        return;
      }

      const data = await googleAuthService.getSpreadsheetData(spreadsheetId, 'Schedule!A:D');
      
      if (!data.values || data.values.length < 2) {
        toast({
          title: "No Data Found",
          description: "The spreadsheet appears to be empty or doesn't have the expected format",
          variant: "destructive",
        });
        return;
      }

      // Convert to team member format
      const teamMembers = data.values.slice(1).map((row: string[]) => ({
        teamMember: row[0] || "",
        analyst: row[1] || "",
        loginTime: row[2] || "",
        timeOffs: row[3] || "",
      }));

      onDataLoaded(teamMembers);
      
      toast({
        title: "Success",
        description: `Loaded ${teamMembers.length} team members from Google Sheets`,
      });

    } catch (error: any) {
      console.error('Error loading spreadsheet data:', error);
      
      let errorMessage = "Failed to load data from Google Sheets";
      
      if (error.status === 403) {
        errorMessage = "Access denied. Please make sure the spreadsheet is shared with you or publicly accessible.";
      } else if (error.status === 404) {
        errorMessage = "Spreadsheet not found. Please check the URL and try again.";
      } else if (error.result?.error?.message) {
        errorMessage = error.result.error.message;
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
          <FileSpreadsheet className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Load from Google Sheets
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your Google Sheets URL to load team schedule data. Make sure you're signed in and have access to the spreadsheet.
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
          
          <Button 
            onClick={handleLoadData} 
            disabled={isLoading || !spreadsheetUrl.trim()}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading Data...
              </>
            ) : (
              <>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Load Schedule Data
              </>
            )}
          </Button>
        </div>

        <Separator className="my-6" />

        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Required Spreadsheet Format
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Your Google Sheet should have a "Schedule" tab with these columns:</p>
                <ul className="ml-4 list-disc space-y-1 mt-2">
                  <li><strong>Column A:</strong> Team Member (name)</li>
                  <li><strong>Column B:</strong> Analyst (supervisor name)</li>
                  <li><strong>Column C:</strong> Login Time (format: "10:00 AM", "2:30 PM", etc.)</li>
                  <li><strong>Column D:</strong> Time Offs (format: "Monday, Tuesday" - comma-separated days)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}