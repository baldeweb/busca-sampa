import type { Period } from "@/web/components/place/OpeningHoursModal";

function parseTime(str: string): number {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}

export function isOpenNow(periods: Period[]): boolean {
  const now = new Date();
  const currentDay = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"][now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const period of periods) {
    if (period.open && period.close) {
      if (period.days.includes(currentDay) || period.days.includes("EVERYDAY")) {
        const openMinutes = parseTime(period.open);
        const closeMinutes = parseTime(period.close);
        // Normal same-day window
        if (openMinutes <= closeMinutes) {
          if (openMinutes <= currentMinutes && currentMinutes < closeMinutes) return true;
        } else {
          // Overnight window (e.g. open 22:00, close 05:00)
          // Consider open if current time is after open (today) or before close (next day)
          if (currentMinutes >= openMinutes || currentMinutes < closeMinutes) return true;
        }
      }
    }
  }
  return false;
}
