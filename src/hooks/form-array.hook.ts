import {
  AbstractArrayState,
  FormArrayBuilderState,
  FormArrayControlProps,
  FormArrayGroupProps,
  FormArrayProps,
  FormState,
  ValidatorError,
  ValidatorFn,
  ValidatorGroupFn
} from '@rolster/helpers-forms';
import {
  controlsToDirty,
  controlsToState,
  evalFormControlValid,
  evalFormGroupValid
} from '@rolster/helpers-forms/helpers';
import { LegacyRef, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  ReactArrayControl,
  ReactArrayControls,
  ReactArrayGroup,
  ReactFormArray
} from './types';

interface ReactFormArrayControlProps<T = any> extends FormArrayControlProps<T> {
  active?: boolean;
  dirty?: boolean;
  disabled?: boolean;
}

interface AbstractRolsterArrayControl<
  T = any,
  C extends ReactArrayControls = any
> extends ReactArrayControl<HTMLElement, T> {
  formGroup?: RolsterArrayGroup<C>;
  validators?: ValidatorFn<T>[];
}

type RolsterArrayControls = ReactArrayControls<AbstractRolsterArrayControl>;

class RolsterArrayControl<T = any, C extends ReactArrayControls = any>
  implements AbstractRolsterArrayControl<T, C>
{
  public readonly uuid: string;
  public readonly active: boolean;
  public readonly disabled: boolean;
  public readonly dirty: boolean;
  public readonly errors: ValidatorError<T>[];
  public readonly invalid: boolean;
  public readonly valid: boolean;
  public readonly value: T;
  public readonly error?: ValidatorError<T> | undefined;
  public readonly state?: FormState<T>;
  public readonly validators?: ValidatorFn<T>[] | undefined;

  formGroup?: RolsterArrayGroup<C> | undefined;
  elementRef?: LegacyRef<HTMLElement> | undefined;

  constructor(props: ReactFormArrayControlProps<T>) {
    const { uuid, active, dirty, disabled, state, validators } = props;

    this.uuid = uuid;
    this.active = active || false;
    this.dirty = dirty || false;
    this.disabled = disabled || false;
    this.state = state;
    this.validators = validators;

    this.errors = (() =>
      validators ? evalFormControlValid({ state, validators }) : [])();

    this.error = (() => this.errors[0])();
    this.valid = (() => this.errors.length === 0)();
    this.invalid = (() => !this.valid)();
    this.value = state as T;
  }

  public setActive(active: boolean): void {
    this.formGroup?.formArray?.update(this, { active });
  }

  public setDirty(dirty: boolean): void {
    this.formGroup?.formArray?.update(this, { dirty });
  }

  public setDisabled(disabled: boolean): void {
    this.formGroup?.formArray?.update(this, { disabled });
  }

  public setState(state?: FormState<T>): void {
    this.formGroup?.formArray?.update(this, { state });
  }

  public reset(): void {}
}

interface RolsterArrayGroup<T extends RolsterArrayControls>
  extends ReactArrayGroup<T> {
  formArray?: RolsterFormArray<T>;
  validators?: ValidatorGroupFn<T>[];
}

interface RolsterFormArray<T extends ReactArrayControls>
  extends ReactFormArray<T> {
  update(
    control: AbstractRolsterArrayControl<any>,
    changes: Partial<ReactFormArrayControlProps<any>>
  ): void;
}

function createArrayGroup<T extends RolsterArrayControls>(
  props: FormArrayGroupProps<T>
): RolsterArrayGroup<T> {
  const { controls, uuid, validators } = props;

  const errors = (() =>
    validators ? evalFormGroupValid({ controls, validators }) : [])();

  const error = (() => errors[0])();
  const valid = (() => errors.length === 0)();
  const invalid = (() => !valid)();

  const dirty = (() => controlsToDirty(controls))();

  const formGroup = {
    controls,
    dirty,
    errors,
    invalid,
    uuid,
    valid,
    error,
    validators
  };

  Object.values(controls).forEach((control) => (control.formGroup = formGroup));

  return formGroup;
}

function createControlsFromState<T extends ReactArrayControls>(
  state: Partial<AbstractArrayState<T>>,
  builder: FormArrayBuilderState<T>
): T {
  return Object.entries(builder(state)).reduce((controls, [key, props]) => {
    controls[key] = new RolsterArrayControl({
      ...props,
      uuid: uuid(),
      dirty: !!props.state
    });

    return controls;
  }, {} as any);
}

function cloneArrayControl<T>(
  control: AbstractRolsterArrayControl<T>,
  changes: Partial<ReactFormArrayControlProps<T>>
): AbstractRolsterArrayControl<T> {
  const { active, dirty, disabled, uuid, state, validators } = control;

  return new RolsterArrayControl({
    uuid,
    active,
    dirty,
    disabled,
    state,
    validators,
    ...changes
  });
}

function cloneArrayGroup<T = any, C extends ReactArrayControls = any>(
  group: RolsterArrayGroup<C>,
  control: AbstractRolsterArrayControl<T>,
  changes: Partial<ReactFormArrayControlProps<T>>
): RolsterArrayGroup<C> {
  const newControl = cloneArrayControl(control, changes);

  const controls = Object.entries(group.controls).reduce(
    (json, [key, control]) => {
      json[key] = control.uuid === newControl.uuid ? newControl : control;

      return json;
    },
    {} as any
  );

  return createArrayGroup({
    controls,
    uuid: group.uuid,
    validators: group.validators
  });
}

export function useFormArray<T extends ReactArrayControls>(
  props: FormArrayProps<T>
): ReactFormArray<T> {
  const [state, setState] = useState(props.state);
  const [currentState] = useState(props.state);

  const { builder, validators } = props;

  const [controls, setControls] = useState<T[]>([]);
  const [groups, setGroups] = useState<RolsterArrayGroup<T>[]>(
    props.state
      ? props.state.map((state) =>
          createArrayGroup({
            controls: createControlsFromState(state, builder),
            uuid: uuid(),
            validators
          })
        )
      : []
  );

  useEffect(() => {
    setControls(groups.map(({ controls }) => controls));
    setState(groups.map(({ controls }) => controlsToState(controls)));
  }, [groups]);

  const errors = (() =>
    validators
      ? groups.reduce(
          (errors, { controls }) => [
            ...errors,
            ...evalFormGroupValid({ controls, validators })
          ],
          [] as ValidatorError[]
        )
      : [])();

  const error = (() => errors[0])();
  const valid = (() => errors.length === 0)();
  const invalid = (() => !valid)();

  const dirty = (() =>
    groups.reduce(
      (currentDirty, { controls }) => currentDirty && controlsToDirty(controls),
      true
    ))();

  function push(state: Partial<AbstractArrayState<T>>): void {
    setGroups([
      ...groups,
      createArrayGroup({
        controls: createControlsFromState(state, builder),
        uuid: uuid(),
        validators
      })
    ]);
  }

  function update(
    control: AbstractRolsterArrayControl<T>,
    changes: Partial<ReactFormArrayControlProps<T>>
  ): void {
    if (control.formGroup) {
      const group = cloneArrayGroup(control.formGroup, control, changes);

      setGroups(
        groups.map((currentGroup) =>
          currentGroup.uuid === group.uuid ? group : currentGroup
        )
      );
    }
  }

  function remove(group: ReactArrayGroup<T>): void {
    setGroups(groups.filter(({ uuid }) => group.uuid !== uuid));
  }

  function reset(): void {
    setGroups(
      currentState
        ? currentState.map((state) =>
            createArrayGroup({
              controls: createControlsFromState(state, builder),
              uuid: uuid(),
              validators
            })
          )
        : []
    );
  }

  const formArray: RolsterFormArray<T> = {
    controls,
    dirty,
    error,
    errors,
    groups,
    invalid,
    push,
    remove,
    reset,
    state,
    update,
    valid,
    value: state as T[]
  };

  groups.forEach((group) => (group.formArray = formArray));

  return formArray;
}
