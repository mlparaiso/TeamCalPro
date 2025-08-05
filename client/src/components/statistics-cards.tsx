import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, CalendarX } from "lucide-react";
import type { Statistics } from "@shared/schema";

interface StatisticsCardsProps {
  statistics: Statistics;
}

export function StatisticsCards({ statistics }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Team Members</p>
              <p className="text-2xl font-semibold text-foreground">{statistics.totalMembers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Active Shifts</p>
              <p className="text-2xl font-semibold text-foreground">{statistics.activeShifts}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarX className="h-8 w-8 text-amber-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Time Offs</p>
              <p className="text-2xl font-semibold text-foreground">{statistics.timeOffs}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
