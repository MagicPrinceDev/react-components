import {
  FormGroupProps,
  StateControls,
  ValueControls
} from '@rolster/helpers-forms';
import {
  controlsToState,
  controlsToTouched,
  controlsToValid,
  controlsToValue,
  evalFormGroupValid
} from '@rolster/helpers-forms/helpers';
import { useState } from 'react';
import { ReactControls, ReactGroup } from './types';

export function useFormGroup<T extends ReactControls>(
  props: FormGroupProps<T>
): ReactGroup<T> {
  const [validators, setValidators] = useState(props.validators);

  const { controls } = props;

  const errors = (() =>
    validators ? evalFormGroupValid({ controls, validators }) : [])();

  const error = (() => errors[0])();
  const valid = (() => errors.length === 0 && controlsToValid(controls))();
  const invalid = (() => !valid)();

  const touched = (() => controlsToTouched(controls))();

  function reset(): void {
    Object.values(controls).forEach((control) => control.reset());
  }

  function states(): StateControls<T> {
    return controlsToState(controls);
  }

  function values(): ValueControls<T> {
    return controlsToValue(controls);
  }

  return {
    controls,
    error,
    errors,
    invalid,
    reset,
    states,
    setValidators,
    touched,
    valid,
    values
  };
}
