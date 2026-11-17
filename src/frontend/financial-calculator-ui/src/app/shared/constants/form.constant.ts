import { Validators } from '@angular/forms';
import { CURRENCY_CODES } from '@core/constants/currency.constant';
import { MIN_MONEY_AMOUNT } from '@core/constants/finance.constant';
import { CurrencyOption } from '@shared/interfaces/currency-option.interface';

export const REQUIRED_MONEY_VALIDATORS = [Validators.required, Validators.min(MIN_MONEY_AMOUNT)];
export const DESCRIPTION_MAX_LENGTH = 60;
export const CURRENCY_OPTIONS: CurrencyOption[] = CURRENCY_CODES.map(code => ({ value: code, label: code }));
