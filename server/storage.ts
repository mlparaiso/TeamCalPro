import { type TeamMember, type ScheduleData, type AnalystOption, type Statistics } from "@shared/schema";

export interface IStorage {
  getTeamMembers(): Promise<TeamMember[]>;
  getAnalysts(): Promise<AnalystOption[]>;
  getScheduleData(analyst: string, day: string): Promise<ScheduleData[]>;
  getStatistics(analyst: string, day: string): Promise<Statistics>;
}

export class MemStorage implements IStorage {
  private teamMembers: TeamMember[];

  constructor() {
    this.teamMembers = [];
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return this.teamMembers;
  }

  async getAnalysts(): Promise<AnalystOption[]> {
    const analystNames = this.teamMembers.map(member => member.analyst);
    const uniqueAnalysts = Array.from(new Set(analystNames));
    return uniqueAnalysts.map(analyst => ({
      value: analyst.toLowerCase().replace(/\s+/g, '-'),
      label: analyst
    }));
  }

  async getScheduleData(analyst: string, day: string): Promise<ScheduleData[]> {
    const filteredMembers = this.teamMembers.filter(member => 
      analyst === "all" || !analyst || member.analyst.toLowerCase().replace(/\s+/g, '-') === analyst
    );

    return filteredMembers.map(member => {
      const timeOffs = member.timeOffs.split(',').map(day => day.trim().toLowerCase());
      const isTimeOff = timeOffs.includes(day.toLowerCase());
      
      const shiftStart = this.convertTo24Hour(member.loginTime);
      const shiftEnd = (shiftStart + 9) % 24;

      return {
        teamMember: member.teamMember,
        analyst: member.analyst,
        loginTime: member.loginTime,
        timeOffs,
        shiftStart,
        shiftEnd,
        isTimeOff
      };
    });
  }

  async getStatistics(analyst: string, day: string): Promise<Statistics> {
    const scheduleData = await this.getScheduleData(analyst, day);
    
    return {
      totalMembers: scheduleData.length,
      activeShifts: scheduleData.filter(data => !data.isTimeOff).length,
      timeOffs: scheduleData.filter(data => data.isTimeOff).length
    };
  }

  setTeamMembers(members: TeamMember[]) {
    this.teamMembers = members;
  }

  private convertTo24Hour(time12h: string): number {
    const [time, modifier] = time12h.split(' ');
    let [hours] = time.split(':');
    let hour = parseInt(hours, 10);
    
    if (hour === 12) hour = 0;
    if (modifier === 'PM') hour = hour + 12;
    
    return hour;
  }
}

export const storage = new MemStorage();
