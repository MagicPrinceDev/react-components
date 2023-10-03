import { hasPattern } from '@rolster/helpers-string';
import {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useState
} from 'react';
import { ReactControl, useListControl } from '../../../hooks';
import { ListFieldElement } from '../../../models';
import { renderClassStatus } from '../../../utils/css';
import { RlsIcon, RlsProgressBar } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsBallot } from '../../molecules';
import './AutocompleteField.css';

const DURATION_ANIMATION = 240;
const MAX_ELEMENTS = 6;

interface AutocompleteField<T = unknown> extends RlsComponent {
  suggestions: ListFieldElement<T>[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement>;
  onSearch?: (pattern: string) => void;
  onSelect?: (value: T) => void;
  placeholder?: string;
  searching?: boolean;
}

interface Store<T> {
  coincidences?: ListFieldElement<T>[];
  pattern: string;
  previous: Store<T> | null;
}

type StoreNulleable<T> = Store<T> | null;

export function RlsAutocompleteField<T = unknown>({
  suggestions,
  children,
  disabled,
  formControl,
  onSearch,
  onSelect,
  placeholder,
  searching,
  rlsTheme
}: AutocompleteField<T>) {
  const [pattern, setPattern] = useState('');
  const [coincidences, setCoincidences] = useState<ListFieldElement<T>[]>([]);
  const [store, setStore] = useState<Store<T>>({
    pattern: '',
    coincidences: [],
    previous: null
  });

  const {
    active,
    boxContentRef,
    higher,
    inputRef,
    listRef,
    suggestionsField,
    value,
    visible,
    setActive,
    setValue,
    setVisible,
    navigationElement,
    navigationInput
  } = useListControl(suggestions, true);

  const [changeInternal, setChangeInternal] = useState(false);

  useEffect(() => {
    filterSuggestions(pattern, true);
  }, [suggestions]);

  useEffect(() => {
    filterSuggestions(pattern);
  }, [pattern]);

  useEffect(() => {
    if (!changeInternal) {
      setValue(
        (formControl?.state &&
          suggestionsField.hasElement(formControl?.state)?.description) ||
          ''
      );
    }

    setChangeInternal(false);
  }, [formControl?.state]);

  function onClickControl(): void {
    if (!disabled) {
      setVisible(true);

      setTimeout(() => inputRef?.current?.focus(), DURATION_ANIMATION);
    }
  }

  function onFocusInput(): void {
    setActive(true);
  }

  function onBlurInput(): void {
    setActive(false);
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
    if (value) {
      setVisible(false);
      setValue('');

      if (formControl) {
        setChangeInternal(true);
        formControl.setState(undefined);
      }
    } else {
      setVisible(true);

      setTimeout(() => inputRef?.current?.focus(), DURATION_ANIMATION);
    }
  }

  function onClickBackdrop(): void {
    setVisible(false);
  }

  function onClickItem(element: ListFieldElement<T>): MouseEventHandler {
    return () => {
      onChange(element);
    };
  }

  function onKeydownItem(element: ListFieldElement<T>): KeyboardEventHandler {
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

  function onChange(element: ListFieldElement<T>): void {
    const { description, value } = element;

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
  }

  function filterSuggestions(pattern: string | null, reboot = false): void {
    if (pattern) {
      const store = reboot ? createStoreEmpty() : searchForPattern(pattern);

      const filters = store?.coincidences || suggestions;

      const coincidences = filters.filter((element) =>
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

  function searchForPattern(value: string): StoreNulleable<T> {
    if (!store.pattern) {
      return null;
    }

    let newStore: StoreNulleable<T> = store;
    let search = false;

    while (!search && newStore) {
      search = hasPattern(value, newStore.pattern, true);

      if (!search) {
        newStore = newStore.previous;
      }
    }

    return newStore || rebootStore();
  }

  function rebootStore(): Store<T> {
    const newStore = createStoreEmpty();

    setStore(newStore);

    return newStore;
  }

  function createStoreEmpty(): Store<T> {
    return {
      coincidences: undefined,
      pattern: '',
      previous: null
    };
  }

  return (
    <div
      ref={boxContentRef}
      className={
        'rls-autocomplete-field rls-list-field ' +
        renderClassStatus('rls-box-field', {
          disabled,
          active,
          selected: !!value
        })
      }
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-box-field__label">{children}</label>}
      <div className="rls-box-field__component">
        <div className="rls-box-field__body">
          <label className="rls-list-field__control" onClick={onClickControl}>
            {value ? (
              <span className="rls-list-field__control__description">
                {value}
              </span>
            ) : (
              <span className="rls-list-field__control__placeholder">
                {placeholder}
              </span>
            )}
          </label>

          <button
            className="rls-list-field__action"
            disabled={disabled}
            onClick={onClickAction}
          >
            <RlsIcon value={value ? 'trash-2' : 'list'} />
          </button>
        </div>
      </div>

      <div
        className={renderClassStatus('rls-list-field__suggestions', {
          visible,
          hide: !visible,
          higher
        })}
      >
        <ul ref={listRef} className="rls-list-field__ul">
          <div className="rls-list-field__ul__search">
            <input
              ref={inputRef}
              className="rls-list-field__ul__control"
              type="text"
              value={pattern}
              onChange={({ target: { value } }) => {
                setPattern(value);
              }}
              disabled={disabled || searching}
              onFocus={onFocusInput}
              onBlur={onBlurInput}
              onKeyDown={onKeydownInput}
            />

            {onSearch && (
              <button
                disabled={disabled || searching}
                onClick={() => {
                  onSearch(pattern);
                }}
              >
                <RlsIcon value="search" />
              </button>
            )}
          </div>

          {searching && <RlsProgressBar indeterminate={true} />}

          {coincidences.map((element, index) => (
            <li
              key={index}
              className="rls-list-field__element"
              tabIndex={-1}
              onClick={onClickItem(element)}
              onKeyDown={onKeydownItem(element)}
            >
              <RlsBallot
                subtitle={element.subtitle}
                img={element.img}
                initials={element.initials}
              >
                {element.title}
              </RlsBallot>
            </li>
          ))}

          {!coincidences.length && (
            <li className="rls-list-field__empty">
              <div className="rls-list-field__empty__description">
                <label className="label-bold truncate">
                  Selección no disponible
                </label>
                <label className="caption-regular">
                  Lo sentimos, en el momento no hay elementos en el listado
                </label>
              </div>
            </li>
          )}
        </ul>

        <div
          className="rls-list-field__backdrop"
          onClick={onClickBackdrop}
        ></div>
      </div>
    </div>
  );
}
