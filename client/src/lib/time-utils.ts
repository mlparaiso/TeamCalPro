export const TIME_SLOTS = [
  '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM',
  '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM'
];

export const DAYS_OF_WEEK = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' }
];

export function convertTo24Hour(time12h: string): number {
  const [time, modifier] = time12h.split(' ');
  let [hours] = time.split(':');
  let hour = parseInt(hours, 10);
  
  if (hour === 12) hour = 0;
  if (modifier === 'PM') hour = hour + 12;
  
  return hour;
}

export function convertTo12Hour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

export function calculateShiftPosition(startHour: number): { startCol: number; spanCols: number } {
  const gridStartHour = 10; // 10 AM
  const startCol = Math.max(0, startHour - gridStartHour + 2); // +2 for team member column
  const spanCols = Math.min(9, 12 - Math.max(0, startHour - gridStartHour));
  
  return { startCol, spanCols };
}

export function formatShiftTime(loginTime: string): string {
  const startHour = convertTo24Hour(loginTime);
  const endHour = (startHour + 9) % 24;
  
  const startTime = convertTo12Hour(startHour);
  const endTime = convertTo12Hour(endHour);
  
  return `${startTime} - ${endTime}`;
}

export function getTeamMemberColor(index: number): string {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-teal-500 to-teal-600'
  ];
  return colors[index % colors.length];
}

export function getTeamMemberInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
