import {
  FormControlProps,
  FormState,
  SubscriberControl
} from '@rolster/helpers-forms';
import { controlIsValid } from '@rolster/helpers-forms/helpers';
import { useEffect, useRef, useState } from 'react';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ReactFormControl, ReactHtmlControl, ReactInputControl } from './types';

export function useReactControl<E extends HTMLElement, T = any>(
  props: FormControlProps<T> = {}
): ReactFormControl<E, T> {
  const [state, setCurrentState] = useState<FormState<T>>(props.state);
  const [value, setValue] = useState<T>(props.state as T);
  const [touched, setTouched] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [initialValue] = useState<FormState<T>>(props.state);
  const [validators, setValidators] = useState(props.validators);
  const [subscribers] = useState<BehaviorSubject<FormState<T>>>(
    new BehaviorSubject(props.state)
  );

  const elementRef = useRef<E>(null);

  const errors = (() =>
    validators ? controlIsValid({ state, validators }) : [])();

  const error = (() => errors[0])();
  const valid = (() => errors.length === 0)();
  const invalid = (() => !valid)();

  useEffect(() => {
    if (state !== null && state !== undefined) {
      setValue(state);
    }

    subscribers.next(state);
  }, [state]);

  function setState(state?: FormState<T>): void {
    setDirty(true);
    setCurrentState(state);
  }

  function reset(): void {
    setTouched(false);
    setDirty(false);
    setCurrentState(initialValue);
  }

  function subscribe(subscriber: SubscriberControl<T>): Subscription {
    return subscribers.subscribe(subscriber);
  }

  return {
    active,
    dirty,
    disabled,
    elementRef,
    enabled: !disabled,
    error,
    errors,
    invalid,
    pristine: !dirty,
    reset,
    setActive,
    setDisabled,
    setValidators,
    setState,
    setTouched,
    state,
    subscribe,
    touched,
    untouched: !touched,
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
