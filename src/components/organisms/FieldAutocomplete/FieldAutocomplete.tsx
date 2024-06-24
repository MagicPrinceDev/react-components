import {
  AbstractAutocompleteElement as Element,
  AutocompleteElement
} from '@rolster/helpers-components';
import { ReactControl } from '@rolster/react-forms';
import { ReactNode } from 'react';
import reactI18n from '../../../i18n';
import { renderClassStatus } from '../../../helpers/css';
import { RlsMessageIcon, RlsIcon, RlsProgressBar } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsBallot } from '../../molecules';
import { useFieldAutocomplete } from './FieldAutocompleteHook';
import './FieldAutocomplete.css';

interface FieldAutocompleteProps<T = unknown, E extends Element<T> = Element<T>>
  extends RlsComponent {
  suggestions: E[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, T>;
  hiddenIcon?: boolean;
  placeholder?: string;
  searching?: boolean;
  onSearch?: (pattern: string) => void;
  onSelect?: (value: T) => void;
  onValue?: (value?: T) => void;
}

interface FieldAutocompleteTemplateProps<
  T = unknown,
  E extends Element<T> = Element<T>
> extends FieldAutocompleteProps<T, E> {
  render: (element: E) => ReactNode;
}

export function RlsFieldAutocompleteTemplate<
  T = unknown,
  E extends Element<T> = Element<T>
>({
  suggestions,
  children,
  disabled,
  formControl,
  hiddenIcon,
  placeholder,
  searching,
  rlsTheme,
  onSearch,
  onSelect,
  onValue,
  render
}: FieldAutocompleteTemplateProps<T, E>) {
  const {
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
  } = useFieldAutocomplete({
    suggestions,
    disabled,
    formControl,
    onSelect,
    onValue
  });

  return (
    <div
      ref={listControl.boxContentRef}
      className={renderClassStatus(
        'rls-field-box',
        {
          disabled,
          focused: listControl.focused,
          selected: !!listControl.value
        },
        'rls-field-list rls-field-autocomplete'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <label className="rls-field-list__control" onClick={onClickControl}>
            {listControl.value ? (
              <span className="rls-field-list__control__description">
                {listControl.value}
              </span>
            ) : (
              <span className="rls-field-list__control__placeholder">
                {placeholder}
              </span>
            )}
          </label>

          {!hiddenIcon && listControl.value && (
            <button
              className="rls-field-list__action"
              disabled={disabled}
              onClick={onClickAction}
            >
              <RlsIcon value="trash-2" />
            </button>
          )}
        </div>
      </div>

      {formControl?.touched && formControl?.error && (
        <div className="rls-field-box__error">
          <RlsMessageIcon icon="alert-triangle" rlsTheme="danger">
            {formControl.error.message}
          </RlsMessageIcon>
        </div>
      )}

      <div
        className={renderClassStatus('rls-field-list__suggestions', {
          visible: listControl.visible,
          hide: !listControl.visible,
          higher: listControl.higher
        })}
      >
        <div className="rls-field-list__suggestions__body">
          <ul ref={listControl.listRef} className="rls-field-list__ul">
            <div className="rls-field-list__ul__search">
              <input
                ref={listControl.inputRef}
                className="rls-field-list__ul__control"
                type="text"
                placeholder={reactI18n('listInputPlaceholder')}
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
                className="rls-field-list__element"
                tabIndex={-1}
                onClick={onClickElement(element)}
                onKeyDown={onKeydownElement(element)}
              >
                {render(element)}
              </li>
            ))}

            {!coincidences.length && (
              <li className="rls-field-list__empty">
                <div className="rls-field-list__empty__description">
                  <label className="rls-label-bold truncate">
                    {reactI18n('listEmptyTitle')}
                  </label>
                  <p className="rls-caption-regular">
                    {reactI18n('listEmptyDescription')}
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>

        <div
          className="rls-field-list__backdrop"
          onClick={onClickBackdrop}
        ></div>
      </div>
    </div>
  );
}

export function RlsFieldAutocomplete<T = unknown>(
  props: FieldAutocompleteProps<T, AutocompleteElement<T>>
) {
  return (
    <RlsFieldAutocompleteTemplate
      {...props}
      render={(element) => (
        <RlsBallot
          subtitle={element.subtitle}
          img={element.img}
          initials={element.initials}
        >
          {element.title}
        </RlsBallot>
      )}
    />
  );
}
