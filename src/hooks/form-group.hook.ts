import {
  AbstractGroup,
  FormControls,
  ValidatorError,
  ValidatorGroupFn,
  evalFormControlsValid
} from '@rolster/helpers-forms';
import { useState } from 'react';

type JsonControl<T extends FormControls> = Record<keyof T, any>;

export function useFormGroup<T extends FormControls>(
  controls: T,
  validatorsFn?: ValidatorGroupFn[]
): AbstractGroup<T> {
  const [validators] = useState<ValidatorGroupFn[]>(validatorsFn || []);

  const [validGroup, setValid] = useState<boolean>(true);
  const [errors, setErrors] = useState<ValidatorError[]>([]);
  const [error, setError] = useState<ValidatorError>();

  const valid = (() =>
    validGroup &&
    Object.values(controls).reduce(
      (validState, { valid }) => validState && valid,
      true
    ))();

  const invalid = (() => !valid)();

  function reset(): void {
    Object.values(controls).forEach((control) => control.reset());
  }

  function json(): JsonControl<T> {
    return Object.entries(controls).reduce<any>((json, [key, { state }]) => {
      json[key] = state;
      return json;
    }, {});
  }

  function updateValidity(): void {
    const errors = evalFormControlsValid({ controls, validators });

    setErrors(errors);
    setError(errors[0]);

    setValid(errors.length === 0);
  }

  function updateValueAndValidity(): void {
    Object.values(controls).forEach((control) =>
      control.updateValueAndValidity()
    );
  }

  const formGroup = {
    controls,
    errors,
    error,
    invalid,
    json,
    reset,
    updateValidity,
    updateValueAndValidity,
    valid
  };

  Object.values(controls).forEach((control) => control.setGroup(formGroup));

  return formGroup;
}
