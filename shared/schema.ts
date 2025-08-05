import { z } from "zod";

export const teamMemberSchema = z.object({
  teamMember: z.string(),
  analyst: z.string(),
  loginTime: z.string(),
  timeOffs: z.string(),
});

export const scheduleDataSchema = z.object({
  teamMember: z.string(),
  analyst: z.string(),
  loginTime: z.string(),
  timeOffs: z.array(z.string()),
  shiftStart: z.number(),
  shiftEnd: z.number(),
  isTimeOff: z.boolean(),
});

export const analystOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const statisticsSchema = z.object({
  totalMembers: z.number(),
  activeShifts: z.number(),
  timeOffs: z.number(),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;
export type ScheduleData = z.infer<typeof scheduleDataSchema>;
export type AnalystOption = z.infer<typeof analystOptionSchema>;
export type Statistics = z.infer<typeof statisticsSchema>;
