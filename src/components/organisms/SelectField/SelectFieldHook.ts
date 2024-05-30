import {
  AbstractListElement as Element,
  ListCollection
} from '@rolster/helpers-components';
import { FormState } from '@rolster/helpers-forms';
import { ReactControl } from '@rolster/react-forms';
import {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useRef
} from 'react';
import { ListControl, useListControl } from '../../../hooks';

export interface SelectControl<T = unknown, E extends Element<T> = Element<T>> {
  listControl: ListControl<T>;
  onBlurInput: () => void;
  onClickAction: () => void;
  onClickBackdrop: () => void;
  onClickElement: (element: E) => MouseEventHandler;
  onClickInput: () => void;
  onFocusInput: () => void;
  onKeydownElement: (element: E) => KeyboardEventHandler;
  onKeydownInput: (event: KeyboardEvent) => void;
}

interface SelectProps<T = unknown, E extends Element<T> = Element<T>> {
  suggestions: E[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, T>;
  onSelect?: (value: T) => void;
  onValue?: (value?: T) => void;
}

export function useSelectField<T = unknown, E extends Element<T> = Element<T>>({
  suggestions,
  formControl,
  onSelect,
  onValue
}: SelectProps<T, E>): SelectControl<T, E> {
  const listControl = useListControl({ suggestions, formControl });

  const {
    collection,
    inputRef,
    visible,
    navigationElement,
    navigationInput,
    setFocused,
    setValue,
    setVisible
  } = listControl;

  const changeInternal = useRef(false);

  useEffect(() => {
    if (changeInternal.current) {
      changeInternal.current = false;
    } else {
      resetState(formControl?.state);
    }
  }, [formControl?.state]);

  useEffect(
    () => resetCollection(collection, formControl?.state),
    [collection]
  );

  function setFormState(value: Undefined<T>): void {
    if (formControl) {
      changeInternal.current = true;
      formControl.setState(value);
    }
  }

  function resetCollection(
    collection: ListCollection<T>,
    state: FormState<T>
  ): void {
    setValue(state ? collection.find(state)?.description || '' : '');
  }

  function resetState(state: FormState<T>): void {
    resetCollection(collection, state);
  }

  function onFocusInput(): void {
    setFocused(true);
  }

  function onBlurInput(): void {
    setFocused(false);
  }

  function onClickInput(): void {
    setVisible(true);
  }

  function onKeydownInput(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Space':
      case 'Enter':
        setVisible(true);
        break;

      case 'Escape':
      case 'Tab':
        setVisible(false);
        break;

      default:
        navigationInput(event);
        break;
    }
  }

  function onClickAction(): void {
    const newVisible = !visible;

    setVisible(newVisible);

    if (newVisible) {
      inputRef?.current?.focus();
    }
  }

  function onClickBackdrop(): void {
    setVisible(false);
  }

  function onClickElement(element: Element<T>): MouseEventHandler {
    return () => {
      onChange(element);
    };
  }

  function onKeydownElement(element: Element<T>): KeyboardEventHandler {
    return (event) => {
      event.code === 'Enter' ? onChange(element) : navigationElement(event);
    };
  }

  function onChange({ description, value }: Element<T>): void {
    inputRef?.current?.focus();

    setVisible(false);

    if (onSelect) {
      onSelect(value);
    } else {
      setFormState(value);
      setValue(description);
    }

    if (onValue) {
      onValue(value);
    }
  }

  return {
    listControl,
    onBlurInput,
    onClickAction,
    onClickBackdrop,
    onClickInput,
    onClickElement,
    onFocusInput,
    onKeydownElement,
    onKeydownInput
  };
}
