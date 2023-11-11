import {
  FormGroupProps,
  StateControls,
  ValueControls
} from '@rolster/helpers-forms';
import {
  controlsAllChecked,
  controlsSomeChecked,
  controlsToState,
  controlsToValue,
  groupIsValid
} from '@rolster/helpers-forms/helpers';
import { useState } from 'react';
import { ReactControls, ReactGroup } from './types';

export function useFormGroup<T extends ReactControls>(
  props: FormGroupProps<T>
): ReactGroup<T> {
  const [validators, setValidators] = useState(props.validators);

  const { controls } = props;

  const errors = (() =>
    validators ? groupIsValid({ controls, validators }) : [])();

  const error = (() => errors[0])();
  const valid = (() =>
    errors.length === 0 && controlsAllChecked(controls, 'valid'))();
  const invalid = (() => !valid)();

  const touched = (() => controlsSomeChecked(controls, 'touched'))();
  const toucheds = (() => controlsAllChecked(controls, 'touched'))();
  const dirty = (() => controlsSomeChecked(controls, 'dirty'))();
  const dirties = (() => controlsAllChecked(controls, 'dirty'))();

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
    dirty,
    dirties,
    error,
    errors,
    invalid,
    pristine: !dirty,
    pristines: !dirties,
    reset,
    states,
    setValidators,
    touched,
    toucheds,
    untouched: !touched,
    untoucheds: !toucheds,
    valid,
    values
  };
}
