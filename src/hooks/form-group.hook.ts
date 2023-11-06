import {
  AbstractFormGroup,
  AbstractGroupControls,
  JsonControls,
  ValidatorGroupFn,
  controlsToJson,
  controlsToValid,
  evalFormGroupValid
} from '@rolster/helpers-forms';
import { useState } from 'react';
import { ReactFormArray } from './form-array.hook';
import { ReactControl } from './form-control.hook';

export type ReactControls = Record<
  string,
  ReactControl<HTMLElement> | ReactFormArray<any>
>;

export type ReactGroup<T extends ReactControls> = AbstractFormGroup<T>;

export function useFormGroup<T extends AbstractGroupControls>(
  controls: T,
  initialValidators: ValidatorGroupFn<T>[] = []
): AbstractFormGroup<T> {
  const [validators, setValidators] =
    useState<ValidatorGroupFn<T>[]>(initialValidators);

  const errors = (() => evalFormGroupValid({ controls, validators }))();
  const error = (() => errors[0])();
  const valid = (() => errors.length === 0 && controlsToValid(controls))();
  const invalid = (() => !valid)();

  function reset(): void {
    Object.values(controls).forEach((control) => control.reset());
  }

  function json(): JsonControls<T> {
    return controlsToJson(controls);
  }

  function updateValueAndValidity(): void {}

  return {
    controls,
    error,
    errors,
    invalid,
    json,
    reset,
    setValidators,
    updateValueAndValidity,
    valid
  };
}
