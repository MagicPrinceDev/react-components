import {
  AbstractAutocompleteElement as Element,
  AutocompleteStore,
  ListCollection,
  createStoreAutocomplete
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState
} from 'react';
import { ListControl, useListControl } from '../../../hooks';

const DURATION_ANIMATION = 240;
const MAX_ELEMENTS = 6;

export interface FieldAutocompleteControl<
  T = unknown,
  E extends Element<T> = Element<T>
> {
  coincidences: E[];
  listControl: ListControl<T>;
  onBlurInput: () => void;
  onClickAction: () => void;
  onClickBackdrop: () => void;
  onClickControl: () => void;
  onClickElement: (element: E) => MouseEventHandler;
  onFocusInput: () => void;
  onKeydownElement: (element: E) => KeyboardEventHandler;
  onKeydownInput: (event: KeyboardEvent) => void;
  pattern: string;
  setPattern: (value: string) => void;
}

interface FieldAutocompleteProps<T = any, E extends Element<T> = Element<T>> {
  suggestions: E[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, T | undefined>;
  onSelect?: (value: T) => void;
  onValue?: (value?: T) => void;
}

export function useFieldAutocomplete<
  T = any,
  E extends Element<T> = Element<T>
>({
  disabled,
  formControl,
  onSelect,
  onValue,
  suggestions
}: FieldAutocompleteProps<T, E>): FieldAutocompleteControl<T, E> {
  const [pattern, setPattern] = useState('');
  const [coincidences, setCoincidences] = useState<E[]>([]);
  const currentStore = useRef<AutocompleteStore<T, E>>({
    pattern: '',
    coincidences: [],
    previous: null
  });

  const listControl = useListControl({ suggestions, formControl });

  const {
    collection,
    inputRef,
    navigationElement,
    navigationInput,
    setFocused,
    setValue,
    setVisible
  } = listControl;

  const initializedState = useRef(false);
  const initializedCollection = useRef(false);
  const changeInternal = useRef(false);

  useEffect(() => {
    refreshCoincidences(pattern, true);
  }, [suggestions]);

  useEffect(() => {
    refreshCoincidences(pattern);
  }, [pattern]);

  useEffect(() => {
    if (!initializedState.current || !initializedCollection.current) {
      initializedState.current = true;
      return;
    }

    if (changeInternal.current) {
      changeInternal.current = false;
      return;
    }

    refresh(collection, formControl?.value);
  }, [formControl?.value]);

  useEffect(() => {
    if (!initializedCollection.current || !initializedState.current) {
      initializedCollection.current = true;
      return;
    }

    refresh(collection, formControl?.value);
  }, [collection]);

  function refresh(collection: ListCollection<T>, state?: T): void {
    if (!state) {
      return setValue('');
    }

    const element = collection.find(state);

    if (element) {
      return setValue(element.description);
    }

    setValue('');
    setFormState(undefined);
  }

  function setFormState(value: Undefined<T>): void {
    if (formControl) {
      changeInternal.current = true;
      formControl.setValue(value);
    }
  }

  function onClickControl(): void {
    if (!disabled) {
      setVisible(true);

      setTimeout(() => {
        inputRef?.current?.focus();
      }, DURATION_ANIMATION);
    }
  }

  function onFocusInput(): void {
    setFocused(true);
  }

  function onBlurInput(): void {
    setFocused(false);
  }

  function onKeydownInput(event: KeyboardEvent): void {
    switch (event.code) {
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
    setVisible(false);
    setValue('');
    setFormState(undefined);

    if (onValue) {
      onValue(undefined);
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

  function refreshCoincidences(pattern: string | null, reboot = false): void {
    const { collection, store } = createStoreAutocomplete({
      pattern,
      suggestions,
      reboot,
      store: currentStore.current
    });

    currentStore.current = store;
    setCoincidences(collection.slice(0, MAX_ELEMENTS));
  }

  return {
    coincidences,
    listControl,
    onBlurInput,
    onClickAction,
    onClickBackdrop,
    onClickControl,
    onClickElement,
    onFocusInput,
    onKeydownElement,
    onKeydownInput,
    pattern,
    setPattern
  };
}
