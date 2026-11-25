import { RateChange } from './rate-change.interface';

export interface AmortizationOptions {
  monthlyInsurance: number;
  balanceInsuranceRatePercent: number;
  graceMonths: number;
  rateChange: RateChange | null;
  extraMonthlyPayment: number;
}
