import {
  AbstractGroup,
  FormControls,
  ValidatorGroupFn,
  evalFormControlsValid
} from '@rolster/helpers-forms';

type JsonControl<T extends FormControls> = Record<keyof T, any>;

export function useFormGroup<T extends FormControls>(
  controls: T,
  validators?: ValidatorGroupFn<T>[]
): AbstractGroup<T> {
  const errors = (() =>
    validators ? evalFormControlsValid({ controls, validators }) : [])();

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

  function updateValidity(): void {}

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

  return formGroup;
}
