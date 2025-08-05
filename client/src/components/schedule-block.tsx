import { cn } from "@/lib/utils";
import { formatShiftTime, calculateShiftPosition } from "@/lib/time-utils";
import type { ScheduleData } from "@shared/schema";

interface ScheduleBlockProps {
  schedule: ScheduleData;
  colorClass: string;
}

export function ScheduleBlock({ schedule, colorClass }: ScheduleBlockProps) {
  const { startCol, spanCols } = calculateShiftPosition(schedule.shiftStart);
  const shiftTimeRange = formatShiftTime(schedule.loginTime);

  if (schedule.isTimeOff || spanCols <= 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute inset-y-1 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group",
        `bg-gradient-to-r ${colorClass}`
      )}
      style={{
        left: `${((startCol - 2) * 100) / 12}%`,
        width: `${(spanCols * 100) / 12}%`,
        marginLeft: '4px',
        marginRight: '4px'
      }}
      title={`${schedule.teamMember}: ${shiftTimeRange}`}
    >
      <div className="px-3 py-2 text-white text-sm font-medium h-full flex flex-col justify-center">
        <div className="truncate">{schedule.teamMember}</div>
        <div className="text-xs opacity-90 truncate">{shiftTimeRange}</div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
        {schedule.teamMember}: {shiftTimeRange} (9 hours)
      </div>
    </div>
  );
}
