import { CurrencyCode } from '@core/@types/currency-code.type';
import { createRecordId } from '@core/functions/record.function';
import { DEFAULT_FEE_MODE } from '../constants/loan-offers.constant';
import { LoanOffer } from '../models';

export function createLoanOffer(currency: CurrencyCode): LoanOffer {
  return {
    id: createRecordId(),
    createdAt: Date.now(),
    bankName: '',
    currency,
    amount: 0,
    annualRatePercent: 0,
    termMonths: 0,
    disbursementFeePercent: 0,
    feeMode: DEFAULT_FEE_MODE,
    monthlyInsurance: 0,
    otherInitialCharges: 0
  };
}
