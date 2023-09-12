import { hasPattern } from '@rolster/typescript-utils';
import {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useState
} from 'react';
import { ReactControl, useListState } from '../../../hooks';
import { ListFieldElement } from '../../../models';
import { renderClassStatus } from '../../../utils/css';
import { RlsIcon, RlsProgressBar } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsBallot } from '../../molecules';
import './AutocompleteField.css';

const DURATION_ANIMATION = 240;
const MAX_ELEMENTS = 6;

interface AutocompleteField extends RlsComponent {
  suggestions: ListFieldElement[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement>;
  placeholder?: string;
  searching?: boolean;
  onSelect?: (value: any) => void;
  onSearch?: (pattern: string) => void;
}

interface Store {
  coincidences?: ListFieldElement[];
  pattern: string;
  previous: Store | null;
}

type StoreNulleable = Store | null;

export function RlsAutocompleteField({
  suggestions,
  children,
  disabled,
  formControl,
  placeholder,
  searching,
  rlsTheme,
  onSelect,
  onSearch
}: AutocompleteField) {
  const [pattern, setPattern] = useState('');
  const [coincidences, setCoincidences] = useState<ListFieldElement[]>([]);
  const [store, setStore] = useState<Store>({
    pattern: '',
    coincidences: [],
    previous: null
  });

  const {
    boxContentRef,
    inputRef,
    listRef,
    active,
    higher,
    value,
    visible,
    setActive,
    setValue,
    setVisible,
    navigationElement,
    navigationInput
  } = useListState(true);

  useEffect(() => {
    filterSuggestions(pattern, true);
  }, [suggestions]);

  useEffect(() => {
    filterSuggestions(pattern);
  }, [pattern]);

  useEffect(() => {
    setValue(formControl?.value ? String(formControl.value) : '');
  }, [formControl?.value]);

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

  function onClickElement(element: ListFieldElement): MouseEventHandler {
    return () => {
      onChange(element);
    };
  }

  function onKeydownElement(element: ListFieldElement): KeyboardEventHandler {
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

  function onChange(element: ListFieldElement): void {
    const { description, value } = element;

    setVisible(false);

    if (onSelect) {
      onSelect(value);
    } else {
      formControl ? formControl.setState(value) : setValue(description);
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

  function searchForPattern(value: string): StoreNulleable {
    if (!store.pattern) {
      return null;
    }

    let newStore: StoreNulleable = store;
    let search = false;

    while (!search && newStore) {
      search = hasPattern(value, newStore.pattern, true);

      if (!search) {
        newStore = newStore.previous;
      }
    }

    return newStore || rebootStore();
  }

  function rebootStore(): Store {
    const newStore = createStoreEmpty();

    setStore(newStore);

    return newStore;
  }

  function createStoreEmpty(): Store {
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
              onClick={onClickElement(element)}
              onKeyDown={onKeydownElement(element)}
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
