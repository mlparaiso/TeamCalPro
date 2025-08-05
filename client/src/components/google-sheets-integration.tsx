import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Key } from "lucide-react";
import { GoogleAuthButton } from "./google-auth-button";
import { SpreadsheetSelector } from "./spreadsheet-selector";
import { ApiKeySync } from "./api-key-sync";
import { queryClient } from "@/lib/queryClient";

interface GoogleSheetsIntegrationProps {
  onDataLoaded?: () => void;
}

export function GoogleSheetsIntegration({ onDataLoaded }: GoogleSheetsIntegrationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDataLoaded = async (teamMembers?: any[]) => {
    try {
      setIsLoading(true);
      
      // If teamMembers are provided (from OAuth), sync them to backend
      if (teamMembers && teamMembers.length > 0) {
        const response = await fetch('/api/sync-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ teamMembers }),
        });

        if (!response.ok) {
          throw new Error('Failed to sync data');
        }
      }

      // Refresh all queries to show new data
      queryClient.invalidateQueries({ queryKey: ["/api/analysts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      
      onDataLoaded?.();
      
    } catch (error) {
      console.error('Error handling data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Google Sheets Integration
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose your preferred method to connect to Google Sheets
          </p>
        </div>

        <Tabs defaultValue="oauth" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="oauth" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>OAuth (Recommended)</span>
              <Badge variant="secondary" className="text-xs">Secure</Badge>
            </TabsTrigger>
            <TabsTrigger value="apikey" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>API Key</span>
              <Badge variant="outline" className="text-xs">Direct</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="oauth" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-2">
                  OAuth Authentication (Recommended)
                </h4>
                <p className="text-sm text-green-700">
                  Sign in with your Google account for secure access to your spreadsheets. 
                  This method doesn't require sharing your sheets publicly and provides better security.
                </p>
              </div>
              
              <GoogleAuthButton 
                onSignInSuccess={() => {}} 
                onSignOut={() => {}} 
              />
              
              <SpreadsheetSelector 
                onDataLoaded={handleDataLoaded} 
                isLoading={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="apikey" className="space-y-4">
            <ApiKeySync 
              onDataLoaded={handleDataLoaded} 
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}