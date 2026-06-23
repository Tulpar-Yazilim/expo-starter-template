import type { AxiosError } from 'axios';
import { Dimensions } from 'react-native';
import { showMessage } from 'react-native-flash-message';

export const IS_ANDROID = process.env.EXPO_OS === 'android';
export const IS_IOS = process.env.EXPO_OS === 'ios';
const { width, height } = Dimensions.get('screen');

export const WIDTH = width;
export const HEIGHT = height;

// For onError react queries and mutations
export const showError = (error: AxiosError) => {
  const description = extractError(error?.response?.data).trimEnd();

  showMessage({
    description,
    message: 'Error',
    type: 'danger',
    duration: 4000,
    icon: 'danger',
  });
};

export const showErrorMessage = (message: string = 'Something went wrong ') => {
  showMessage({
    message,
    type: 'danger',
    duration: 4000,
  });
};

export const extractError = (data: unknown): string => {
  if (typeof data === 'string') {
    return data;
  }
  if (Array.isArray(data)) {
    const messages = data.map((item) => `  ${extractError(item)}`);

    return `${messages.join('')}`;
  }

  if (typeof data === 'object' && data !== null) {
    const messages = Object.entries(data).map((item) => {
      const [key, value] = item;
      const separator = Array.isArray(value) ? ':\n ' : ': ';

      return `- ${key}${separator}${extractError(value)} \n `;
    });
    return `${messages.join('')} `;
  }
  return 'Something went wrong ';
};

// Mask types
export const MASKS = {
  phone: '(XXX) XXX-XXXX',
  phoneInternational: '+X (XXX) XXX-XXXX',
  phoneInternationalDynamic: 'dynamic',
  email: '',
  creditCard: 'XXXX XXXX XXXX XXXX',
  cpf: 'XXX.XXX.XXX-XX',
  cnpj: 'XX.XXX.XXX/XXXX-XX',
  zipCode: 'XXXXX-XXX',
} as const;

export type MaskType = keyof typeof MASKS;

export type MaskPattern = {
  pattern: string;
  allowOnlyNumbers?: boolean;
  maxLength?: number;
};

export type MaskConfig = Record<string, MaskPattern>;

export const COUNTRY_PHONE_CODES: Record<
  string,
  {
    code: string;
    length: number;
    pattern: string;
    country: string;
  }
> = {
  tr: {
    code: '90',
    length: 12,
    pattern: '+90 (XXX) XXX-XXXX',
    country: 'Turkey',
  },
  us: { code: '1', length: 11, pattern: '+1 (XXX) XXX-XXXX', country: 'USA' },
  uk: {
    code: '44',
    length: 12,
    pattern: '+44 XXXX XXXXXX',
    country: 'United Kingdom',
  },
  de: {
    code: '49',
    length: 12,
    pattern: '+49 XXX XXXXXXX',
    country: 'Germany',
  },
  fr: {
    code: '33',
    length: 12,
    pattern: '+33 X XX XX XX XX',
    country: 'France',
  },
  it: { code: '39', length: 12, pattern: '+39 XXX XXXXXX', country: 'Italy' },
  es: {
    code: '34',
    length: 12,
    pattern: '+34 XXX XX XX XX',
    country: 'Spain',
  },
  br: {
    code: '55',
    length: 13,
    pattern: '+55 (XX) XXXXX-XXXX',
    country: 'Brazil',
  },
  mx: {
    code: '52',
    length: 12,
    pattern: '+52 XXX XXX XXXX',
    country: 'Mexico',
  },
  ca: {
    code: '1',
    length: 11,
    pattern: '+1 (XXX) XXX-XXXX',
    country: 'Canada',
  },
  au: {
    code: '61',
    length: 12,
    pattern: '+61 X XXXX XXXX',
    country: 'Australia',
  },
  jp: {
    code: '81',
    length: 11,
    pattern: '+81 XX XXXX XXXX',
    country: 'Japan',
  },
  cn: {
    code: '86',
    length: 12,
    pattern: '+86 XXX XXXX XXXX',
    country: 'China',
  },
  in: {
    code: '91',
    length: 12,
    pattern: '+91 XXXXX XXXXX',
    country: 'India',
  },
  sg: {
    code: '65',
    length: 10,
    pattern: '+65 XXXX XXXX',
    country: 'Singapore',
  },
  hk: {
    code: '852',
    length: 12,
    pattern: '+852 XXXX XXXX',
    country: 'Hong Kong',
  },
};

// Default mask configurations
export const DEFAULT_MASKS: MaskConfig = {
  phone: {
    pattern: '(XXX) XXX-XXXX',
    allowOnlyNumbers: true,
    maxLength: 14,
  },
  phoneInternational: {
    pattern: '+X (XXX) XXX-XXXX',
    allowOnlyNumbers: true,
    maxLength: 16,
  },
  creditCard: {
    pattern: 'XXXX XXXX XXXX XXXX',
    allowOnlyNumbers: true,
    maxLength: 19,
  },
  cpf: {
    pattern: 'XXX.XXX.XXX-XX',
    allowOnlyNumbers: true,
    maxLength: 14,
  },
  cnpj: {
    pattern: 'XX.XXX.XXX/XXXX-XX',
    allowOnlyNumbers: true,
    maxLength: 18,
  },
  zipCode: {
    pattern: 'XXXXX-XXX',
    allowOnlyNumbers: true,
    maxLength: 9,
  },
  date: {
    pattern: 'XX/XX/XXXX',
    allowOnlyNumbers: true,
    maxLength: 10,
  },
  time: {
    pattern: 'XX:XX',
    allowOnlyNumbers: true,
    maxLength: 5,
  },
};

/**
 * Get phone mask pattern by country code
 * @param countryCode - Country code (e.g., 'tr', 'us', 'br')
 * @returns Mask pattern (e.g., '+90 (XXX) XXX-XXXX')
 */
export const getPhonePatternByCountry = (
  countryCode: string,
): string | null => {
  const country = COUNTRY_PHONE_CODES[countryCode.toLowerCase()];
  return country ? country.pattern : null;
};

/**
 * Get maximum phone number length by country code
 * @param countryCode - Country code
 * @returns Maximum length
 */
export const getPhoneLengthByCountry = (countryCode: string): number | null => {
  const country = COUNTRY_PHONE_CODES[countryCode.toLowerCase()];
  return country ? country.length : null;
};

/**
 * FIXED: Dynamic international phone masking
 * Automatically detects country code and applies appropriate pattern
 * Now properly handles clearing/deletion
 * @param value - Phone number
 * @returns Masked phone number
 * @example
 * applyInternationalPhoneMask('901234567890') // +90 (123) 456-7890
 * applyInternationalPhoneMask('12125552368') // +1 (212) 555-2368
 * applyInternationalPhoneMask('') // '' (properly clears)
 */
export const applyInternationalPhoneMask = (value: string): string => {
  // Handle empty or just '+' character
  if (!value || value === '' || value === '+') {
    return '';
  }

  // Extract only digits from input
  let cleaned = value.replace(/\D/g, '');

  // If no digits left, return empty string
  if (cleaned.length === 0) {
    return '';
  }

  let countryCode = '';
  let nationalNumber = '';
  let pattern = '';

  // Try to match country code - check 3-digit first (most specific)
  if (cleaned.length >= 3) {
    const threeDigitCode = cleaned.substring(0, 3);
    const foundCountry = Object.values(COUNTRY_PHONE_CODES).find(
      (c) => c.code === threeDigitCode,
    );
    if (foundCountry) {
      countryCode = threeDigitCode;
      nationalNumber = cleaned.substring(3);
      pattern = foundCountry.pattern;
    }
  }

  // If 3-digit code not found, check for 2-digit code
  if (!countryCode && cleaned.length >= 2) {
    const twoDigitCode = cleaned.substring(0, 2);
    const foundCountry = Object.values(COUNTRY_PHONE_CODES).find(
      (c) => c.code === twoDigitCode,
    );
    if (foundCountry) {
      countryCode = twoDigitCode;
      nationalNumber = cleaned.substring(2);
      pattern = foundCountry.pattern;
    }
  }

  // If 2-digit code not found, check for 1-digit code
  if (!countryCode && cleaned.length >= 1) {
    const oneDigitCode = cleaned.substring(0, 1);
    const foundCountry = Object.values(COUNTRY_PHONE_CODES).find(
      (c) => c.code === oneDigitCode,
    );
    if (foundCountry) {
      countryCode = oneDigitCode;
      nationalNumber = cleaned.substring(1);
      pattern = foundCountry.pattern;
    }
  }

  // If no country code matched yet, show what user typed with + prefix
  if (!countryCode) {
    if (cleaned.length <= 3) {
      return `+${cleaned}`;
    }
    // Default pattern if we can't identify country yet
    pattern = '+XX (XXX) XXX-XXXX';
    countryCode = cleaned.substring(0, 2);
    nationalNumber = cleaned.substring(2);
  }

  // Build formatted result
  let result = `+${countryCode}`;

  // Find where pattern starts (after country code part)
  const patternAfterCode = pattern.substring(pattern.indexOf(' '));

  let inputIndex = 0;
  for (
    let i = 0;
    i < patternAfterCode.length && inputIndex < nationalNumber.length;
    i++
  ) {
    const char = patternAfterCode[i];
    if (char === 'X') {
      result += nationalNumber[inputIndex];
      inputIndex++;
    } else if (char === ' ' || char === '(' || char === ')' || char === '-') {
      result += char;
    }
  }

  return result;
};

/**
 * Extract country code from international phone number
 * @param phone - International phone number (e.g., +90 (123) 456-7890)
 * @returns Country code (e.g., '90') or null
 */
export const extractCountryCode = (phone: string): string | null => {
  const cleaned = phone.replace(/\D/g, '');

  // Check for 3-digit code
  if (cleaned.length >= 3) {
    const threeDigit = cleaned.substring(0, 3);
    if (Object.values(COUNTRY_PHONE_CODES).some((c) => c.code === threeDigit)) {
      return threeDigit;
    }
  }

  // Check for 2-digit code
  if (cleaned.length >= 2) {
    const twoDigit = cleaned.substring(0, 2);
    if (Object.values(COUNTRY_PHONE_CODES).some((c) => c.code === twoDigit)) {
      return twoDigit;
    }
  }

  // Check for 1-digit code
  if (cleaned.length >= 1) {
    const oneDigit = cleaned.substring(0, 1);
    if (Object.values(COUNTRY_PHONE_CODES).some((c) => c.code === oneDigit)) {
      return oneDigit;
    }
  }

  return null;
};

/**
 * Extract national number part from international phone number
 * @param phone - International phone number (e.g., +90 (123) 456-7890)
 * @returns National number part (e.g., 1234567890)
 */
export const extractNationalNumber = (phone: string): string => {
  const countryCode = extractCountryCode(phone);
  const cleaned = phone.replace(/\D/g, '');

  if (countryCode) {
    return cleaned.substring(countryCode.length);
  }

  return cleaned;
};

/**
 * Get country name from country code
 * @param countryCode - Country code (e.g., 'tr', 'us')
 * @returns Country name or null
 */
export const getCountryNameByCode = (countryCode: string): string | null => {
  const country = COUNTRY_PHONE_CODES[countryCode.toLowerCase()];
  return country ? country.country : null;
};

/**
 * Get all supported countries
 * @returns Array of countries
 */
export const getSupportedCountries = (): Array<{
  code: string;
  countryCode: string;
  name: string;
  pattern: string;
}> =>
  Object.entries(COUNTRY_PHONE_CODES).map(([code, data]) => ({
    code,
    countryCode: data.code,
    name: data.country,
    pattern: data.pattern,
  }));

/**
 * Apply mask pattern to value
 * @param value - Value to be masked
 * @param maskPattern - Mask pattern (e.g., '(XXX) XXX-XXXX')
 * @returns Masked value
 * @example
 * applyMaskPattern('1234567890', '(XXX) XXX-XXXX') // (123) 456-7890
 */
export const applyMaskPattern = (
  value: string,
  maskPattern: string,
): string => {
  // Handle empty input explicitly
  if (!value) {
    return '';
  }

  if (!maskPattern) {
    return '';
  }

  // Extract only digits
  let cleaned = value.replace(/\D/g, '');

  // If no digits left after cleaning, return empty string
  if (cleaned.length === 0) {
    return '';
  }

  let masked = '';
  let inputIndex = 0;

  // Iterate through the mask pattern
  for (let i = 0; i < maskPattern.length && inputIndex < cleaned.length; i++) {
    const patternChar = maskPattern[i];

    if (patternChar === 'X') {
      // Add next digit from input
      masked += cleaned[inputIndex];
      inputIndex++;
    } else {
      // Add separator character from pattern
      masked += patternChar;
    }
  }

  return masked;
};

/**
 * Extract only digits from masked value
 * @param value - Masked value
 * @returns Only digits
 */
export const getUnmaskedValue = (value: string): string =>
  value.replace(/[^\d]/g, '');

/**
 * Apply mask based on mask type
 * @param value - Value to be masked
 * @param maskType - Mask type
 * @returns Masked value
 */
export const applyMaskByType = (
  value: string,
  maskType: keyof typeof DEFAULT_MASKS,
): string => {
  const maskConfig = DEFAULT_MASKS[maskType];
  if (!maskConfig) {
    return value;
  }
  return applyMaskPattern(value, maskConfig.pattern);
};

/**
 * Get mask configuration
 * @param maskType - Mask type
 * @returns Mask configuration or undefined
 */
export const getMaskConfig = (
  maskType: keyof typeof DEFAULT_MASKS,
): MaskPattern | undefined => DEFAULT_MASKS[maskType];

/**
 * Add or override custom mask
 * @param maskType - Mask type name
 * @param maskConfig - Mask configuration
 */
export const addCustomMask = (
  maskType: string,
  maskConfig: MaskPattern,
): void => {
  DEFAULT_MASKS[maskType] = maskConfig;
};

/**
 * Check if mask is completely filled
 * @param value - Masked value
 * @param maskType - Mask type
 * @returns Boolean value
 */
export const isMaskFilled = (
  value: string,
  maskType: keyof typeof DEFAULT_MASKS,
): boolean => {
  const maskConfig = DEFAULT_MASKS[maskType];
  if (!maskConfig || !maskConfig.maxLength) {
    return false;
  }
  return value.length === maskConfig.maxLength;
};

/**
 * Get mask pattern length
 * @param maskType - Mask type
 * @returns Maximum length
 */
export const getMaskLength = (maskType: keyof typeof DEFAULT_MASKS): number => {
  const maskConfig = DEFAULT_MASKS[maskType];
  return maskConfig?.maxLength ?? 0;
};

// Validator helper functions

/**
 * Validate phone number (10 digits)
 * @param phone - Phone number (masked or unmasked)
 * @returns Boolean
 */
export const isValidPhone = (phone: string): boolean => {
  const unmasked = getUnmaskedValue(phone);
  return unmasked.length === 10;
};

/**
 * Validate CPF
 * @param cpf - CPF (masked or unmasked)
 * @returns Boolean (basic check, use CPF algorithm for full validation)
 */
export const isValidCPF = (cpf: string): boolean => {
  const unmasked = getUnmaskedValue(cpf);
  return unmasked.length === 11;
};

/**
 * Validate CNPJ
 * @param cnpj - CNPJ (masked or unmasked)
 * @returns Boolean (basic check, use CNPJ algorithm for full validation)
 */
export const isValidCNPJ = (cnpj: string): boolean => {
  const unmasked = getUnmaskedValue(cnpj);
  return unmasked.length === 14;
};

/**
 * Validate credit card (Luhn algorithm)
 * @param cardNumber - Card number (masked or unmasked)
 * @returns Boolean
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const unmasked = getUnmaskedValue(cardNumber);
  if (unmasked.length < 13 || unmasked.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = unmasked.length - 1; i >= 0; i--) {
    let digit = parseInt(unmasked[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validate date format (MM/DD/YYYY)
 * @param date - Date (masked or unmasked)
 * @returns Boolean
 */
export const isValidDate = (date: string): boolean => {
  const unmasked = getUnmaskedValue(date);
  if (unmasked.length !== 8) {
    return false;
  }

  const month = parseInt(unmasked.substring(0, 2), 10);
  const day = parseInt(unmasked.substring(2, 4), 10);

  return month >= 1 && month <= 12 && day >= 1 && day <= 31;
};
