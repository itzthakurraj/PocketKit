export interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  dayOfWeekBorn: string;
  zodiacSign: string;
  daysUntilNextBirthday: number;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getZodiac(month: number, day: number): string {
  // month is 1-12
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius ♒';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces ♓';
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries ♈';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus ♉';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini ♊';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer ♋';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo ♌';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo ♍';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra ♎';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio ♏';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius ♐';
  return 'Capricorn ♑';
}

export function calculateAgeDetails(dobString: string): AgeBreakdown | null {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  const now = new Date();

  if (isNaN(birthDate.getTime()) || birthDate > now) {
    return null;
  }

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = now.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  const dayOfWeekBorn = DAYS_OF_WEEK[birthDate.getDay()];
  const zodiacSign = getZodiac(birthDate.getMonth() + 1, birthDate.getDate());

  // Next birthday calculation
  let nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < now) {
    nextBirthday = new Date(now.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }
  const msToNext = nextBirthday.getTime() - now.getTime();
  const daysUntilNextBirthday = Math.max(0, Math.ceil(msToNext / (1000 * 60 * 60 * 24)));

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    totalMinutes,
    dayOfWeekBorn,
    zodiacSign,
    daysUntilNextBirthday,
  };
}
