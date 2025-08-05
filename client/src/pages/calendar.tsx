import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Calendar, RefreshCw, Info } from "lucide-react";
import { CalendarGrid } from "@/components/calendar-grid";
import { StatisticsCards } from "@/components/statistics-cards";
import { syncGoogleSheets, getSpreadsheetIdFromUrl } from "@/lib/google-sheets";
import { DAYS_OF_WEEK } from "@/lib/time-utils";
import { queryClient } from "@/lib/queryClient";
import type { AnalystOption, ScheduleData, Statistics } from "@shared/schema";

export default function CalendarPage() {
  const [selectedAnalyst, setSelectedAnalyst] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("monday");
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || ""
  );
  
  const { toast } = useToast();

  // Fetch analysts
  const { data: analysts = [], isLoading: analystsLoading } = useQuery<AnalystOption[]>({
    queryKey: ["/api/analysts"],
  });

  // Fetch schedule data
  const { data: scheduleData = [], isLoading: scheduleLoading } = useQuery<ScheduleData[]>({
    queryKey: ["/api/schedule", selectedAnalyst, selectedDay],
  });

  // Fetch statistics
  const { data: statistics, isLoading: statisticsLoading } = useQuery<Statistics>({
    queryKey: ["/api/statistics", selectedAnalyst, selectedDay],
  });

  // Sync Google Sheets mutation
  const syncMutation = useMutation({
    mutationFn: syncGoogleSheets,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Synced ${data.count} team members from Google Sheets`,
      });
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/analysts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSyncSheets = () => {
    const spreadsheetId = getSpreadsheetIdFromUrl(spreadsheetUrl) || spreadsheetUrl;
    
    if (!spreadsheetId || !apiKey) {
      toast({
        title: "Missing Information",
        description: "Please provide both the Google Sheets URL/ID and API key",
        variant: "destructive",
      });
      return;
    }

    syncMutation.mutate({ spreadsheetId, apiKey });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
    queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">Team Schedule Calendar</h1>
              </div>
            </div>
            
            {/* Controls Section */}
            <div className="flex items-center space-x-4">
              {/* Analyst Selector */}
              <div className="relative">
                <Label className="block text-sm font-medium text-foreground mb-1">
                  Analyst
                </Label>
                <Select value={selectedAnalyst} onValueChange={setSelectedAnalyst}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Analyst" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Analysts</SelectItem>
                    {analysts.map((analyst) => (
                      <SelectItem key={analyst.value} value={analyst.value}>
                        {analyst.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Day Selector */}
              <div className="relative">
                <Label className="block text-sm font-medium text-foreground mb-1">
                  Day
                </Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={handleRefresh}
                disabled={scheduleLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${scheduleLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Google Sheets Sync Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-3 mb-4">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Google Sheets Integration
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Google Sheet to sync team schedule data. Ensure your sheet has columns: 
                  Team Member, Analyst, Login Time, Time Offs.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="spreadsheet-url">Google Sheets URL or ID</Label>
                <Input
                  id="spreadsheet-url"
                  placeholder="https://docs.google.com/spreadsheets/d/... or spreadsheet ID"
                  value={spreadsheetUrl}
                  onChange={(e) => setSpreadsheetUrl(e.target.value)}
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
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSyncSheets} 
              disabled={syncMutation.isPending}
              className="w-full md:w-auto"
            >
              {syncMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                'Sync Google Sheets'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Loading State */}
        {scheduleLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {/* Calendar Grid */}
        {!scheduleLoading && (
          <CalendarGrid scheduleData={scheduleData} />
        )}

        {/* Statistics Cards */}
        {statistics && !statisticsLoading && (
          <>
            <Separator />
            <StatisticsCards statistics={statistics} />
          </>
        )}

        {/* Setup Instructions */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Google Sheets Setup Instructions
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>1. Create a Google Sheet with the following columns:</p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li><strong>Column A:</strong> Team Member (name)</li>
                    <li><strong>Column B:</strong> Analyst (supervisor name)</li>
                    <li><strong>Column C:</strong> Login Time (format: "10:00 AM", "2:30 PM", etc.)</li>
                    <li><strong>Column D:</strong> Time Offs (format: "Monday, Tuesday" - comma-separated days)</li>
                  </ul>
                  <p>2. Enable Google Sheets API and get your API key</p>
                  <p>3. Make your sheet publicly viewable or set up OAuth for private sheets</p>
                  <p>4. Copy your sheet URL and paste it above along with your API key</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
