import { isDefined } from '@rolster/helpers-advanced';
import {
  AbstractFormControl,
  FormState,
  ValidatorFn,
  evalFormControlValid
} from '@rolster/helpers-forms';
import { LegacyRef, useEffect, useRef, useState } from 'react';
import { BehaviorSubject, Subscription } from 'rxjs';

export interface ReactControl<E extends HTMLElement, T = any>
  extends AbstractFormControl<T> {
  elementRef?: LegacyRef<E>;
}

export type ReactInputControl<T = any> = ReactControl<HTMLInputElement, T>;
export type ReactHtmlControl<T = any> = ReactControl<HTMLElement, T>;

type Subscriber<T> = (state?: FormState<T>) => void;

interface ReactControlProps<T> {
  state?: FormState<T>;
  validators?: ValidatorFn<T>[];
}

export function useReactControl<E extends HTMLElement, T = any>(
  props: ReactControlProps<T> = {}
): ReactControl<E, T> {
  const [state, setState] = useState<FormState<T>>(props.state);
  const [value, setValue] = useState<T>(props.state as T);
  const [dirty, setDirty] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [initialValue] = useState<FormState<T>>(props.state);
  const [validators, setValidators] = useState<ValidatorFn<T>[]>(
    props.validators || []
  );
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
    setDirty(false);
    setState(initialValue);
  }

  function subscribe(subscriber: Subscriber<T>): Subscription {
    return subscribers.subscribe(subscriber);
  }

  function updateValueAndValidity(): void {}

  return {
    active,
    dirty,
    disabled,
    elementRef,
    error,
    errors,
    invalid,
    reset,
    setActive,
    setDirty,
    setDisabled,
    setValidators,
    setState,
    subscribe,
    updateValueAndValidity,
    state,
    valid,
    value
  };
}

export function useFormControl<T = any>(
  props: ReactControlProps<T> = {}
): ReactHtmlControl<T> {
  return useReactControl<HTMLElement, T>(props);
}

export function useInputControl<T = any>(
  props: ReactControlProps<T> = {}
): ReactInputControl<T> {
  return useReactControl<HTMLInputElement, T>(props);
}
