import { FormControl, FormState, ValidatorFn } from '@rolster/helpers-forms';
import { LegacyRef } from 'react';
import { ReactControl } from '../hooks';

interface FormControlProps<T> {
  state?: FormState<T>;
  validators?: ValidatorFn<T>[];
}

export class PrimitiveControl<E extends HTMLElement, T = any>
  extends FormControl<T>
  implements ReactControl<E, T>
{
  constructor(
    props: FormControlProps<T>,
    public readonly elementRef?: LegacyRef<E>
  ) {
    super(props);
  }
}
