import {
  AbstractControl,
  FormState,
  ValidatorError,
  ValidatorFn
} from '@rolster/helpers-forms';
import { LegacyRef, useEffect, useRef, useState } from 'react';

export interface ReactControl<E extends HTMLElement, T = any>
  extends AbstractControl<T> {
  elementRef: LegacyRef<E>;
}

type Subscriber<T> = (state?: FormState<T>) => void;

interface Props<T> {
  state?: FormState<T>;
  validators?: ValidatorFn<T>[];
}

export function useReactControl<E extends HTMLElement, T = any>(
  props: Props<T> = {}
): ReactControl<E, T> {
  const [state, setState] = useState<FormState<T>>(props.state);
  const [value, setValue] = useState<T>(props.state as T);
  const [dirty, setDirty] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [initialValue] = useState<FormState<T>>(props.state);
  const [valid, setValid] = useState<boolean>(true);
  const [invalid, setInvalid] = useState<boolean>(false);
  const [validators, setValidators] = useState<ValidatorFn<T>[]>(
    props.validators || []
  );
  const [errors, setErrors] = useState<ValidatorError[]>([]);
  const [error, setError] = useState<ValidatorError>();
  const [subscribers] = useState<Set<Subscriber<T>>>(new Set());

  const elementRef = useRef<E>(null);

  useEffect(() => {
    updateValueAndValidity();

    if (state) {
      setValue(state);
    }

    subscribers.forEach((subscriber) => {
      subscriber(state);
    });
  }, [state]);

  useEffect(() => {
    updateValueAndValidity();
  }, [validators]);

  function reset(): void {
    setDirty(false);
    setState(initialValue);
  }

  function subscribe(subscriber: (state?: FormState<T>) => void): void {
    subscribers.add(subscriber);
  }

  function updateValueAndValidity(): void {
    const errors = validators.reduce((errors, validator) => {
      const error = validator(state);

      if (error) {
        errors.push(error);
      }

      return errors;
    }, [] as ValidatorError[]);

    const [error] = errors;

    setErrors(errors);
    setError(error);

    const validState = errors.length === 0;

    setValid(validState);
    setInvalid(!validState);
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
