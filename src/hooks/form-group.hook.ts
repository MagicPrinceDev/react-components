import { AbstractGroup, FormControls } from '@rolster/helpers-forms';

type JsonControl<T extends FormControls> = Record<keyof T, any>;

export function useFormGroup<T extends FormControls>(
  controls: T
): AbstractGroup<T> {
  function valid(): boolean {
    return Object.values(controls).reduce(
      (validState, { valid }) => validState && valid,
      true
    );
  }

  function invalid(): boolean {
    return !valid();
  }

  function reset(): void {
    Object.values(controls).forEach((control) => control.reset());
  }

  function json(): JsonControl<T> {
    return Object.entries(controls).reduce<any>((json, [key, { state }]) => {
      json[key] = state;
      return json;
    }, {});
  }

  function updateValueAndValidity(): void {
    Object.values(controls).forEach((control) =>
      control.updateValueAndValidity()
    );
  }

  return { controls, invalid, json, reset, updateValueAndValidity, valid };
}
