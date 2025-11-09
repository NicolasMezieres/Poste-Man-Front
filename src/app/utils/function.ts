import { AbstractControl, ValidationErrors } from '@angular/forms';
import {
  patternLowercase,
  patternNumber,
  patternSymbol,
  patternUppercase,
} from './const';

export function matchPasswords(
  control: AbstractControl<{ password: string; confirmPassword: string }>,
): ValidationErrors | null {
  const isSamePassword =
    control.value.password === control.value.confirmPassword
      ? null
      : { notSamePassword: true };
  return isSamePassword;
}

export function passwordValidator(
  control: AbstractControl<string>,
): ValidationErrors | null {
  if (!patternLowercase.test(control.value)) {
    return { lowercase: { value: control.value } };
  }
  if (!patternUppercase.test(control.value)) {
    return { uppercase: { value: control.value } };
  }
  if (!patternNumber.test(control.value)) {
    return { number: { value: control.value } };
  }
  if (!patternSymbol.test(control.value)) {
    return { symbol: { value: control.value } };
  }
  return null;
}
