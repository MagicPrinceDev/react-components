import { FormControls, FormGroup } from '@rolster/helpers-forms';

export function useFormGroup<T extends FormControls>(
  controls: T
): FormGroup<T> {
  return new FormGroup(controls);
}
