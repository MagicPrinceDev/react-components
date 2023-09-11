import { FormControls, FormGroup } from '@rolster/typescript-forms';

export function useFormGroup<T extends FormControls>(
  controls: T
): FormGroup<T> {
  return new FormGroup(controls);
}
