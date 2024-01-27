import { FormState } from '@rolster/helpers-forms';
import { ReactControl } from '@rolster/react-forms';
import {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useState
} from 'react';
import { ListControl, useListControl } from '../../../hooks';
import {
  AbstractListElement as Element,
  ListCollection
} from '../../../models';

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

  const [changeInternal, setChangeInternal] = useState(false);

  useEffect(() => {
    changeInternal ? setChangeInternal(false) : resetState(formControl?.state);
  }, [formControl?.state]);

  useEffect(
    () => resetCollection(collection, formControl?.state),
    [collection]
  );

  function setFormState(value: Undefined<T>): void {
    setChangeInternal(true);
    formControl?.setState(value);
  }

  function resetCollection(
    collection: ListCollection<T>,
    state: FormState<T>
  ): void {
    if (state) {
      const element = collection.find(state);

      if (element) {
        setValue(element.description);
      } else {
        setValue('');
      }
    } else {
      setValue('');
    }
  }

  function resetState(state: FormState<T>): void {
    setValue(state ? collection.find(state)?.description || '' : '');
  }

  function onFocusInput(): void {
    setFocused(true);
  }

  function onBlurInput(): void {
    setFocused(false);
  }

  function onClickControl(): void {
    setVisible(true);
  }

  function onKeydownInput(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Space':
        setVisible(true);
        break;

      case 'Enter':
        setVisible(true);
        break;

      case 'Escape':
        setVisible(false);
        break;

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
      switch (event.code) {
        case 'Enter':
          onChange(element);
          break;

        default:
          navigationElement(event);
          break;
      }
    };
  }

  function onChange({ description, value }: Element<T>): void {
    inputRef?.current?.focus();

    setVisible(false);

    if (onSelect) {
      onSelect(value);
    } else {
      if (formControl) {
        setFormState(value);
      }

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
    onClickInput: onClickControl,
    onClickElement,
    onFocusInput,
    onKeydownElement,
    onKeydownInput
  };
}
