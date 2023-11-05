import {
  AbstractGroup,
  FormControls,
  ValidatorGroupFn,
  evalFormControlsValid
} from '@rolster/helpers-forms';
import { useState } from 'react';

type JsonControl<T extends FormControls> = Record<keyof T, any>;

export type ReactGroup<T extends FormControls> = Omit<
  AbstractGroup<T>,
  'updateValueAndValidity'
>;

export function useFormGroup<T extends FormControls>(
  controls: T,
  initialValidators: ValidatorGroupFn<T>[] = []
): ReactGroup<T> {
  const [validators, setValidators] =
    useState<ValidatorGroupFn<T>[]>(initialValidators);

  const errors = (() => evalFormControlsValid({ controls, validators }))();

  const error = (() => errors[0])();

  const valid = (() =>
    errors.length === 0 &&
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

  return {
    controls,
    error,
    errors,
    invalid,
    json,
    reset,
    setValidators,
    valid
  };
}
