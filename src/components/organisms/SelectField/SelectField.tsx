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
import { RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsBallot } from '../../molecules';
import './SelectField.css';

interface SelectField<T = unknown> extends RlsComponent {
  suggestions: ListFieldElement<T>[];
  children?: any;
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement>;
  placeholder?: string;
}

export function RlsSelectField<T = unknown>({
  suggestions,
  children,
  disabled,
  formControl,
  placeholder,
  rlsTheme
}: SelectField<T>) {
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
  } = useListControl(suggestions);

  const [changeInternal, setChangeInternal] = useState(false);

  useEffect(() => {
    if (!changeInternal) {
      setValue(
        (formControl?.value &&
          suggestionsField.hasElement(formControl?.value)?.description) ||
          ''
      );
    }

    setChangeInternal(false);
  }, [formControl?.value]);

  function onFocusInput(): void {
    setActive(true);
  }

  function onBlurInput(): void {
    setActive(false);
  }

  function onClickInput(): void {
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

  function onChange({ description, value }: ListFieldElement): void {
    inputRef?.current?.focus();

    setVisible(false);

    if (formControl) {
      setChangeInternal(true);
      formControl.setState(value);
    }

    setValue(description);
  }

  return (
    <div
      ref={boxContentRef}
      className={
        'rls-select-field rls-list-field ' +
        renderClassStatus('rls-box-field', { active, disabled })
      }
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-box-field__label">{children}</label>}
      <div className="rls-box-field__component">
        <div className="rls-box-field__body">
          <input
            ref={inputRef}
            className="rls-list-field__control"
            readOnly={true}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onFocus={onFocusInput}
            onBlur={onBlurInput}
            onClick={onClickInput}
            onKeyDown={onKeydownInput}
          />
          <button
            className={renderClassStatus('rls-list-field__action', { visible })}
            disabled={disabled}
            onClick={onClickAction}
          >
            <RlsIcon value="arrow-ios-down" />
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
          {suggestions.map((element, index) => (
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

          {!suggestions.length && (
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
