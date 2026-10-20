export interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  daysUntilNextBirthday: number;
  dayOfWeekBorn: string;
  zodiacSign: string;
}

export function calculateAgeDetails(birthDateStr: string): AgeBreakdown | null {
  if (!birthDateStr) return null;
  const birthDate = new Date(birthDateStr);
  const now = new Date();

  if (isNaN(birthDate.getTime()) || birthDate > now) {
    return null;
  }

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = now.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalSeconds = Math.floor(diffMs / 1000);

  // Next birthday
  const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }
  const daysUntilNextBirthday = Math.ceil(
    (nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekBorn = daysOfWeek[birthDate.getDay()];

  // Zodiac
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  let zodiacSign = 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) zodiacSign = 'Aquarius';
  else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) zodiacSign = 'Pisces';
  else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) zodiacSign = 'Aries';
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) zodiacSign = 'Taurus';
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) zodiacSign = 'Gemini';
  else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) zodiacSign = 'Cancer';
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) zodiacSign = 'Leo';
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) zodiacSign = 'Virgo';
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) zodiacSign = 'Libra';
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) zodiacSign = 'Scorpio';
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) zodiacSign = 'Sagittarius';

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    daysUntilNextBirthday,
    dayOfWeekBorn,
    zodiacSign,
  };
}

export function calculateGST(
  amount: number,
  ratePercent: number,
  mode: 'exclusive' | 'inclusive'
): { netAmount: number; gstAmount: number; totalAmount: number; cgst: number; sgst: number } {
  if (mode === 'exclusive') {
    const gstAmount = (amount * ratePercent) / 100;
    const totalAmount = amount + gstAmount;
    return {
      netAmount: amount,
      gstAmount,
      totalAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
    };
  } else {
    // Inclusive: amount = net * (1 + rate / 100)
    const netAmount = amount / (1 + ratePercent / 100);
    const gstAmount = amount - netAmount;
    return {
      netAmount,
      gstAmount,
      totalAmount: amount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
    };
  }
}

export interface LoanResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  amortizationPreview: { month: number; emi: number; principal: number; interest: number; balance: number }[];
}

export function calculateLoan(
  principal: number,
  annualRate: number,
  tenureYears: number
): LoanResult {
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  if (monthlyRate === 0) {
    const monthlyEmi = principal / totalMonths;
    return {
      monthlyEmi,
      totalInterest: 0,
      totalPayment: principal,
      amortizationPreview: [],
    };
  }

  // Formula: EMI = P * r * (1 + r)^n / [ (1 + r)^n - 1 ]
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const monthlyEmi = (principal * monthlyRate * factor) / (factor - 1);
  const totalPayment = monthlyEmi * totalMonths;
  const totalInterest = totalPayment - principal;

  // Build first 12 months amortization schedule
  const amortizationPreview = [];
  let balance = principal;
  for (let m = 1; m <= Math.min(12, totalMonths); m++) {
    const interest = balance * monthlyRate;
    const princ = monthlyEmi - interest;
    balance = Math.max(0, balance - princ);
    amortizationPreview.push({
      month: m,
      emi: monthlyEmi,
      principal: princ,
      interest,
      balance,
    });
  }

  return {
    monthlyEmi,
    totalInterest,
    totalPayment,
    amortizationPreview,
  };
}

export function calculateSIP(
  monthlyInvestment: number,
  annualReturnRate: number,
  tenureYears: number
): { investedAmount: number; estimatedReturns: number; totalValue: number } {
  const i = annualReturnRate / 12 / 100;
  const n = tenureYears * 12;

  const investedAmount = monthlyInvestment * n;
  if (i === 0) {
    return {
      investedAmount,
      estimatedReturns: 0,
      totalValue: investedAmount,
    };
  }

  // SIP formula: M * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
  const totalValue = monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const estimatedReturns = totalValue - investedAmount;

  return {
    investedAmount,
    estimatedReturns,
    totalValue,
  };
}
