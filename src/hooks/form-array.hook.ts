import {
  AbstractArray,
  AbstractArrayControl,
  AbstractArrayControls,
  AbstractArrayGroup,
  ArrayState,
  FormState,
  ValidatorError,
  ValidatorFn,
  ValidatorGroupFn,
  controlsToJson,
  evalFormControlValid,
  evalFormGroupValid
} from '@rolster/helpers-forms';
import { LegacyRef, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

interface FormArrayControlProps<T> {
  dirty: boolean;
  uuid: string;
  state?: FormState<T>;
  validators?: ValidatorFn<T>[];
}

interface FormArrayGroupProps<T extends AbstractArrayControls> {
  controls: T;
  uuid: string;
  validators?: ValidatorGroupFn<T>[];
}

type ArrayControlProps = Record<
  string,
  Omit<FormArrayControlProps<any>, 'uuid' | 'dirty'>
>;

interface ReactArrayProps<T extends AbstractArrayControls> {
  mapper: (state: ArrayState<T>) => ArrayControlProps;
  state?: ArrayState<T>[];
  validators?: ValidatorGroupFn<T>[];
}

function createArrayControl<T = any>(
  props: FormArrayControlProps<T>
): AbstractArrayControl<T> {
  const { dirty, uuid, state, validators } = props;

  const errors = (() =>
    validators ? evalFormControlValid({ state, validators }) : [])();

  const error = (() => errors[0])();
  const valid = (() => errors.length === 0)();
  const invalid = (() => !valid)();

  return {
    dirty,
    error,
    errors,
    invalid,
    reset: () => {},
    state,
    updateValueAndValidity: () => {},
    uuid,
    valid,
    validators,
    value: state as T
  };
}

function useArrayControl<T = any>(
  props: Omit<FormArrayControlProps<T>, 'uuid'>
): AbstractArrayControl<T> {
  return createArrayControl({
    dirty: props.dirty,
    uuid: uuid(),
    state: props.state,
    validators: props.validators
  });
}

function useArrayGroup<T extends AbstractArrayControls>(
  props: FormArrayGroupProps<T>
): AbstractArrayGroup<T> {
  const { controls, uuid, validators } = props;

  const errors = (() =>
    validators ? evalFormGroupValid({ controls, validators }) : [])();

  const error = (() => errors[0])();
  const valid = (() => errors.length === 0)();
  const invalid = (() => !valid)();

  const arrayGroup = {
    controls,
    error,
    errors,
    invalid,
    uuid,
    valid,
    validators
  };

  Object.values(controls).forEach((control) => (control.group = arrayGroup));

  return arrayGroup;
}

function createControlsFromState<T extends AbstractArrayControls>(
  state: ArrayState<T>,
  mapper: (state: ArrayState<T>) => ArrayControlProps
): T {
  return Object.entries(mapper(state)).reduce((controls, [key, props]) => {
    controls[key] = useArrayControl({ ...props, dirty: !!props.state });

    return controls;
  }, {} as any);
}

export interface ReactArrayControl<T = any> extends AbstractArrayControl<T> {
  elementRef?: LegacyRef<HTMLElement>;
}

export type ReactFormArray<T extends AbstractArrayControls> = AbstractArray<T>;

export function useFormArray<T extends AbstractArrayControls>(
  props: ReactArrayProps<T>
): ReactFormArray<T> {
  const initialState = props.state || [];
  const { mapper, validators } = props;

  const [currentState] = useState(initialState);
  const [state, setState] = useState<ArrayState<T>[]>([]);
  const [groups, setGroups] = useState<AbstractArrayGroup<T>[]>(
    initialState.map((state) =>
      useArrayGroup({
        controls: createControlsFromState(state, mapper),
        uuid: uuid(),
        validators
      })
    )
  );

  useEffect(() => {
    setState(groups.map(({ controls }) => controlsToJson(controls)));
  }, [groups]);

  const errors = (() =>
    validators
      ? groups.reduce((errors, { controls }) => {
          return [...errors, ...evalFormGroupValid({ controls, validators })];
        }, [] as ValidatorError[])
      : [])();

  const error = (() => errors[0])();
  const valid = (() => errors.length === 0)();
  const invalid = (() => !valid)();

  const dirty = (() =>
    groups.reduce(
      (dirty, { controls }) =>
        dirty &&
        Object.values(controls).reduce(
          (dirty, control) => dirty && control.dirty,
          true
        ),
      true
    ))();

  function push(state: ArrayState<T>): void {
    setGroups([
      ...groups,
      useArrayGroup({
        controls: createControlsFromState(state, mapper),
        uuid: uuid(),
        validators
      })
    ]);
  }

  function update(control: AbstractArrayControl, state: FormState): void {
    const controlGroup = control.group;

    if (controlGroup) {
      const newControl = createArrayControl({
        dirty: true,
        uuid: control.uuid,
        state,
        validators: control.validators
      });

      const controls = Object.entries(controlGroup.controls).reduce(
        (json, [key, control]) => {
          json[key] =
            (control as any).uuid === newControl.uuid ? newControl : control;

          return json;
        },
        {} as any
      );

      const newGroup = useArrayGroup({
        controls,
        uuid: controlGroup.uuid,
        validators: controlGroup.validators
      });

      setGroups(
        groups.map((group) => (group.uuid === newGroup.uuid ? newGroup : group))
      );
    }
  }

  function remove(group: AbstractArrayGroup<T>): void {
    setGroups(groups.filter(({ uuid }) => group.uuid !== uuid));
  }

  function reset(): void {
    setGroups(
      currentState.map((state) =>
        useArrayGroup({
          controls: createControlsFromState(state, mapper),
          uuid: uuid(),
          validators
        })
      )
    );
  }

  function updateValueAndValidity(): void {}

  return {
    dirty,
    error,
    errors,
    groups,
    invalid,
    push,
    remove,
    reset,
    state,
    value: state,
    valid,
    update,
    updateValueAndValidity
  };
}
