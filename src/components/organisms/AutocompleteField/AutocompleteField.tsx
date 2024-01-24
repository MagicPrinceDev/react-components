import { ReactControl } from '@rolster/react-forms';
import { ReactNode } from 'react';
import reactI18n from '../../../i18n';
import {
  AbstractAutocompleteElement as Element,
  AutocompleteElement
} from '../../../models';
import { renderClassStatus } from '../../../utils/css';
import { RlsMessageIcon, RlsIcon, RlsProgressBar } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsBallot } from '../../molecules';
import { useAutocompleteField } from './AutocompleteFieldHook';
import './AutocompleteField.css';

interface AutocompleteFieldProps<T = unknown, E extends Element<T> = Element<T>>
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

interface AutocompleteFieldTemplateProps<
  T = unknown,
  E extends Element<T> = Element<T>
> extends AutocompleteFieldProps<T, E> {
  render: (element: E) => ReactNode;
}

export function RlsAutocompleteFieldTemplate<
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
}: AutocompleteFieldTemplateProps<T, E>) {
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
  } = useAutocompleteField({
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
        'rls-box-field',
        {
          disabled,
          focused: listControl.focused,
          selected: !!listControl.value
        },
        'rls-autocomplete-field rls-list-field'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-box-field__label">{children}</label>}

      <div className="rls-box-field__component">
        <div className="rls-box-field__body">
          <label className="rls-list-field__control" onClick={onClickControl}>
            {listControl.value ? (
              <span className="rls-list-field__control__description">
                {listControl.value}
              </span>
            ) : (
              <span className="rls-list-field__control__placeholder">
                {placeholder}
              </span>
            )}
          </label>

          {!hiddenIcon && listControl.value && (
            <button
              className="rls-list-field__action"
              disabled={disabled}
              onClick={onClickAction}
            >
              <RlsIcon value="trash-2" />
            </button>
          )}
        </div>
      </div>

      {formControl?.touched && formControl?.error && (
        <div className="rls-box-field__error">
          <RlsMessageIcon icon="alert-triangle" rlsTheme="danger">
            {formControl.error.message}
          </RlsMessageIcon>
        </div>
      )}

      <div
        className={renderClassStatus('rls-list-field__suggestions', {
          visible: listControl.visible,
          hide: !listControl.visible,
          higher: listControl.higher
        })}
      >
        <div className="rls-list-field__suggestions__body">
          <ul ref={listControl.listRef} className="rls-list-field__ul">
            <div className="rls-list-field__ul__search">
              <input
                ref={listControl.inputRef}
                className="rls-list-field__ul__control"
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
                className="rls-list-field__element"
                tabIndex={-1}
                onClick={onClickElement(element)}
                onKeyDown={onKeydownElement(element)}
              >
                {render(element)}
              </li>
            ))}

            {!coincidences.length && (
              <li className="rls-list-field__empty">
                <div className="rls-list-field__empty__description">
                  <label className="label-bold truncate">
                    {reactI18n('listEmptyTitle')}
                  </label>
                  <p className="caption-regular">
                    {reactI18n('listEmptyDescription')}
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>

        <div
          className="rls-list-field__backdrop"
          onClick={onClickBackdrop}
        ></div>
      </div>
    </div>
  );
}

export function RlsAutocompleteField<T = unknown>(
  props: AutocompleteFieldProps<T, AutocompleteElement<T>>
) {
  return (
    <RlsAutocompleteFieldTemplate
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
