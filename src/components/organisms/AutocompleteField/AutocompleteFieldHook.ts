import { FormState } from '@rolster/helpers-forms';
import { hasPattern } from '@rolster/helpers-string';
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
  AbstractAutocompleteElement as Element,
  ListCollection
} from '../../../models';

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
  const [store, setStore] = useState<Store<T, E>>({
    pattern: '',
    coincidences: [],
    previous: null
  });

  const listControl = useListControl({
    suggestions,
    formControl,
    higher: true
  });

  const {
    collection,
    inputRef,
    navigationElement,
    navigationInput,
    setFocused,
    setValue,
    setVisible
  } = listControl;

  const [changeInternal, setChangeInternal] = useState(false);

  useEffect(() => filterSuggestions(pattern, true), [suggestions]);

  useEffect(() => filterSuggestions(pattern), [pattern]);

  useEffect(() => {
    changeInternal
      ? setChangeInternal(false)
      : reset(collection, formControl?.state);
  }, [formControl?.state]);

  useEffect(() => reset(collection, formControl?.state), [collection]);

  function setFormState(value: Undefined<T>): void {
    setChangeInternal(true);
    formControl?.setState(value);
  }

  function reset(collection: ListCollection<T>, state: FormState<T>): void {
    if (state) {
      const element = collection.find(state);

      if (element) {
        setValue(element.description);
      } else {
        setValue('');
        setFormState(undefined);
      }
    } else {
      setValue('');
    }
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
      setFormState(undefined);
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
        setFormState(value);
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
