import { isDefined } from '@rolster/helpers-advanced';
import {
  FormControlProps,
  FormState,
  SubscriberControl
} from '@rolster/helpers-forms';
import { evalFormControlValid } from '@rolster/helpers-forms/helpers';
import { useEffect, useRef, useState } from 'react';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ReactFormControl, ReactHtmlControl, ReactInputControl } from './types';

export function useReactControl<E extends HTMLElement, T = any>(
  props: FormControlProps<T> = {}
): ReactFormControl<E, T> {
  const [state, setState] = useState<FormState<T>>(props.state);
  const [value, setValue] = useState<T>(props.state as T);
  const [touched, setTouched] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [initialValue] = useState<FormState<T>>(props.state);
  const [validators, setValidators] = useState(props.validators);
  const [subscribers] = useState<BehaviorSubject<FormState<T>>>(
    new BehaviorSubject(props.state)
  );

  const elementRef = useRef<E>(null);

  const errors = (() =>
    validators ? evalFormControlValid({ state, validators }) : [])();

  const error = (() => errors[0])();
  const valid = (() => errors.length === 0)();
  const invalid = (() => !valid)();

  useEffect(() => {
    if (isDefined(state)) {
      setValue(state as T);
    }

    subscribers.next(state);
  }, [state]);

  function reset(): void {
    setTouched(false);
    setState(initialValue);
  }

  function subscribe(subscriber: SubscriberControl<T>): Subscription {
    return subscribers.subscribe(subscriber);
  }

  return {
    active,
    disabled,
    elementRef,
    error,
    errors,
    invalid,
    reset,
    setActive,
    setDisabled,
    setValidators,
    setState,
    subscribe,
    setTouched,
    touched,
    state,
    valid,
    value
  };
}

export function useFormControl<T = any>(
  props: FormControlProps<T> = {}
): ReactHtmlControl<T> {
  return useReactControl<HTMLElement, T>(props);
}

export function useInputControl<T = any>(
  props: FormControlProps<T> = {}
): ReactInputControl<T> {
  return useReactControl<HTMLInputElement, T>(props);
}
