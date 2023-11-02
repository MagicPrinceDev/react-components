import { isDefined } from '@rolster/helpers-advanced';
import {
  AbstractControl,
  AbstractGroup,
  FormState,
  ValidatorError,
  ValidatorFn,
  evalFormStateValid
} from '@rolster/helpers-forms';
import { LegacyRef, useEffect, useRef, useState } from 'react';
import { BehaviorSubject, Subscription } from 'rxjs';

export interface ReactControl<E extends HTMLElement, T = any>
  extends AbstractControl<T> {
  elementRef?: LegacyRef<E>;
}

export type ReactInputControl<T = any> = ReactControl<HTMLInputElement, T>;
export type ReactHtmlControl<T = any> = ReactControl<HTMLElement, T>;

type Subscriber<T> = (state?: FormState<T>) => void;

interface Props<T> {
  state?: FormState<T>;
  validators?: ValidatorFn<T>[];
}

export function useReactControl<E extends HTMLElement, T = any>(
  props: Props<T> = {}
): ReactControl<E, T> {
  const [state, setState] = useState<FormState<T>>(props.state);
  const [group, setGroup] = useState<AbstractGroup<any>>();
  const [value, setValue] = useState<T>(props.state as T);
  const [dirty, setDirty] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [initialValue] = useState<FormState<T>>(props.state);
  const [valid, setValid] = useState<boolean>(true);
  const [validators, setValidators] = useState<ValidatorFn<T>[]>(
    props.validators || []
  );
  const [errors, setErrors] = useState<ValidatorError[]>([]);
  const [error, setError] = useState<ValidatorError>();
  const [subscribers] = useState<BehaviorSubject<FormState<T>>>(
    new BehaviorSubject(props.state)
  );

  const elementRef = useRef<E>(null);

  const invalid = (() => !valid)();

  useEffect(() => {
    updateValueAndValidity();

    if (isDefined(state)) {
      setValue(state as T);
    }

    subscribers.next(state);

    group?.updateValidity();
  }, [state]);

  useEffect(() => {
    updateValueAndValidity();
  }, [validators]);

  function reset(): void {
    setDirty(false);
    setState(initialValue);
  }

  function subscribe(subscriber: Subscriber<T>): Subscription {
    return subscribers.subscribe(subscriber);
  }

  function updateValueAndValidity(): void {
    const errors = evalFormStateValid({ state, validators });

    setErrors(errors);
    setError(errors[0]);

    setValid(errors.length === 0);
  }

  return {
    active,
    dirty,
    disabled,
    elementRef,
    errors,
    invalid,
    valid,
    value,
    error,
    state,
    reset,
    setActive,
    setDirty,
    setDisabled,
    setGroup,
    setValidators,
    setState,
    subscribe,
    updateValueAndValidity
  };
}

type Element<T> = ReactControl<HTMLElement, T>;
type Input<T> = ReactControl<HTMLInputElement, T>;

export function useFormControl<T = any>(props: Props<T> = {}): Element<T> {
  return useReactControl<HTMLElement, T>(props);
}

export function useInputControl<T = any>(props: Props<T> = {}): Input<T> {
  return useReactControl<HTMLInputElement, T>(props);
}
