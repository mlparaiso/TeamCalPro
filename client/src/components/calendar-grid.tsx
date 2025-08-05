import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { CalendarX } from "lucide-react";
import { ScheduleBlock } from "./schedule-block";
import { TIME_SLOTS, getTeamMemberColor, getTeamMemberInitials } from "@/lib/time-utils";
import type { ScheduleData } from "@shared/schema";

interface CalendarGridProps {
  scheduleData: ScheduleData[];
}

export function CalendarGrid({ scheduleData }: CalendarGridProps) {
  if (scheduleData.length === 0) {
    return (
      <Card className="text-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <CalendarX className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground">No schedules found</h3>
          <p className="text-muted-foreground">Select an analyst to view team schedules for the selected day.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Calendar Header */}
      <div className={cn(
        "grid gap-0 border-b border-border bg-muted/50",
        "grid-cols-[200px_repeat(12,minmax(0,1fr))] lg:grid-cols-[200px_repeat(12,minmax(0,1fr))] md:grid-cols-[150px_repeat(12,minmax(60px,1fr))]"
      )}>
        {/* Team Members Header */}
        <div className="px-4 py-3 border-r border-border font-medium text-foreground bg-primary/10">
          Team Members
        </div>
        
        {/* Time Slots Header */}
        {TIME_SLOTS.map((timeSlot, index) => (
          <div 
            key={timeSlot}
            className={cn(
              "px-2 py-3 text-center text-sm font-medium text-muted-foreground border-r border-border min-w-0",
              index === TIME_SLOTS.length - 1 && "border-r-0"
            )}
          >
            <div className="truncate">{timeSlot}</div>
          </div>
        ))}
      </div>

      {/* Team Member Rows */}
      {scheduleData.map((schedule, index) => (
        <div 
          key={`${schedule.teamMember}-${schedule.analyst}`}
          className={cn(
            "grid gap-0 border-b border-border/50 hover:bg-muted/30 transition-colors duration-150",
            "grid-cols-[200px_repeat(12,minmax(0,1fr))] lg:grid-cols-[200px_repeat(12,minmax(0,1fr))] md:grid-cols-[150px_repeat(12,minmax(60px,1fr))]",
            index === scheduleData.length - 1 && "border-b-0",
            schedule.isTimeOff && "opacity-60"
          )}
        >
          {/* Team Member Name */}
          <div className="px-4 py-4 border-r border-border flex items-center space-x-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium",
              schedule.isTimeOff 
                ? "bg-gradient-to-br from-gray-400 to-gray-500"
                : `bg-gradient-to-br ${getTeamMemberColor(index)}`
            )}>
              <span>{getTeamMemberInitials(schedule.teamMember)}</span>
            </div>
            <div>
              <div className={cn(
                "font-medium",
                schedule.isTimeOff ? "text-muted-foreground" : "text-foreground"
              )}>
                {schedule.teamMember}
              </div>
              <div className={cn(
                "text-sm flex items-center space-x-1",
                schedule.isTimeOff ? "text-destructive" : "text-muted-foreground"
              )}>
                {schedule.isTimeOff ? (
                  <>
                    <CalendarX className="h-3 w-3" />
                    <span>Time Off</span>
                  </>
                ) : (
                  <span>Available</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Schedule Time Slots */}
          {TIME_SLOTS.map((_, timeIndex) => (
            <div 
              key={timeIndex}
              className={cn(
                "relative h-16 border-r border-border",
                timeIndex === TIME_SLOTS.length - 1 && "border-r-0",
                schedule.isTimeOff && "bg-muted/50"
              )}
            >
              {timeIndex === 0 && !schedule.isTimeOff && (
                <ScheduleBlock 
                  schedule={schedule} 
                  colorClass={getTeamMemberColor(index)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </Card>
  );
}
