import {
  AbstractAutocompleteElement as Element,
  ListCollection,
  StoreAutocomplete,
  createStoreAutocomplete
} from '@rolster/helpers-components';
import { FormState } from '@rolster/helpers-forms';
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

export interface AutocompleteControl<
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

interface AutocompleteProps<T = unknown, E extends Element<T> = Element<T>> {
  suggestions: E[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, T>;
  onSelect?: (value: T) => void;
  onValue?: (value?: T) => void;
}

export function useAutocompleteField<
  T = unknown,
  E extends Element<T> = Element<T>
>({
  disabled,
  formControl,
  onSelect,
  onValue,
  suggestions
}: AutocompleteProps<T, E>): AutocompleteControl<T, E> {
  const [pattern, setPattern] = useState('');
  const [coincidences, setCoincidences] = useState<E[]>([]);
  const [store, setStore] = useState<StoreAutocomplete<T, E>>({
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

  const changeInternal = useRef(false);

  useEffect(() => filterSuggestions(pattern, true), [suggestions]);

  useEffect(() => filterSuggestions(pattern), [pattern]);

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

  function onClickControl(): void {
    if (!disabled) {
      setVisible(true);

      setTimeout(() => inputRef?.current?.focus(), DURATION_ANIMATION);
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

  function filterSuggestions(pattern: string | null, reboot = false): void {
    const result = createStoreAutocomplete({
      pattern,
      suggestions,
      reboot,
      store
    });

    setCoincidences(result.collection.slice(0, MAX_ELEMENTS));
    setStore(result.store);
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
