import { hasPattern } from '@rolster/helpers-string';
import { ReactControl } from '@rolster/react-forms';
import {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useState
} from 'react';
import { AbstractAutocompleteElement as Element } from '../../../models';
import { ListControl, useListControl } from '../../../hooks';

const DURATION_ANIMATION = 240;
const MAX_ELEMENTS = 6;

interface Store<T, E extends Element<T> = Element<T>> {
  coincidences?: E[];
  pattern: string;
  previous: Store<T, E> | null;
}

type StoreNulleable<T, E extends Element<T> = Element<T>> = Store<T, E> | null;

export interface AutocompleteControl<
  T = unknown,
  E extends Element<T> = Element<T>
> {
  coincidences: E[];
  listControl: ListControl<T>;
  pattern: string;
  onBlurInput: () => void;
  onClickAction: () => void;
  onClickBackdrop: () => void;
  onClickControl: () => void;
  onClickElement: (element: E) => MouseEventHandler;
  onFocusInput: () => void;
  onKeydownElement: (element: E) => KeyboardEventHandler;
  onKeydownInput: (event: KeyboardEvent) => void;
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
  suggestions,
  disabled,
  formControl,
  onSelect,
  onValue
}: AutocompleteProps<T, E>): AutocompleteControl<T, E> {
  const [pattern, setPattern] = useState('');
  const [coincidences, setCoincidences] = useState<E[]>([]);
  const [store, setStore] = useState<Store<T, E>>({
    pattern: '',
    coincidences: [],
    previous: null
  });

  const listControl = useListControl({
    suggestions,
    formControl,
    withHigher: true
  });

  const {
    collection,
    inputRef,
    setFocused,
    setValue,
    setVisible,
    navigationElement,
    navigationInput
  } = listControl;

  const [changeInternal, setChangeInternal] = useState(false);

  useEffect(() => {
    filterSuggestions(pattern, true);
  }, [suggestions]);

  useEffect(() => {
    filterSuggestions(pattern);
  }, [pattern]);

  useEffect(() => {
    if (!changeInternal) {
      redefineDescription();
    }

    setChangeInternal(false);
  }, [formControl?.state]);

  useEffect(() => {
    redefineDescription();
  }, [collection]);

  function redefineDescription(): void {
    const element = formControl?.state && collection.find(formControl?.state);

    setValue(element?.description || '');
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
    setVisible(false);
    setValue('');

    if (formControl) {
      setChangeInternal(true);
      formControl.setState(undefined);
    }

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
    setVisible(false);

    if (onSelect) {
      onSelect(value);
    } else {
      if (formControl) {
        setChangeInternal(true);
        formControl.setState(value);
      }

      setValue(description);
    }

    if (onValue) {
      onValue(value);
    }
  }

  function filterSuggestions(pattern: string | null, reboot = false): void {
    if (pattern) {
      const store = reboot ? createStoreEmpty() : searchForPattern(pattern);

      const elements = store?.coincidences || suggestions;

      const coincidences = elements.filter((element) =>
        element.hasCoincidence(pattern)
      );

      setCoincidences(coincidences.slice(0, MAX_ELEMENTS));

      setStore({
        coincidences,
        pattern,
        previous: store
      });
    } else {
      setCoincidences(suggestions.slice(0, MAX_ELEMENTS));
      rebootStore();
    }
  }

  function searchForPattern(value: string): StoreNulleable<T, E> {
    if (!store.pattern) {
      return null;
    }

    let newStore: StoreNulleable<T, E> = store;
    let search = false;

    while (!search && newStore) {
      search = hasPattern(value, newStore.pattern, true);

      if (!search) {
        newStore = newStore.previous;
      }
    }

    return newStore || rebootStore();
  }

  function rebootStore(): Store<T, E> {
    const store = createStoreEmpty();

    setStore(store);

    return store;
  }

  function createStoreEmpty(): Store<T, E> {
    return {
      coincidences: undefined,
      pattern: '',
      previous: null
    };
  }

  return {
    coincidences,
    listControl,
    pattern,
    onBlurInput,
    onClickAction,
    onClickBackdrop,
    onClickControl,
    onClickElement,
    onFocusInput,
    onKeydownElement,
    onKeydownInput,
    setPattern
  };
}
