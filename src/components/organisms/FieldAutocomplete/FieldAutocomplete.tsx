import {
  AbstractAutocompleteElement as Element,
  AutocompleteElement
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { ReactNode } from 'react';
import reactI18n from '../../../i18n';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon, RlsProgressBar } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsBallot, RlsMessageFormError } from '../../molecules';
import { useFieldAutocomplete } from './FieldAutocompleteHook';
import './FieldAutocomplete.css';

interface FieldAutocompleteProps<T = any, E extends Element<T> = Element<T>>
  extends RlsComponent {
  suggestions: E[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, T | undefined>;
  hiddenIcon?: boolean;
  onSearch?: (pattern: string) => void;
  onSelect?: (value: T) => void;
  onValue?: (value?: T) => void;
  placeholder?: string;
  searching?: boolean;
}

interface FieldAutocompleteTemplateProps<
  T = any,
  E extends Element<T> = Element<T>
> extends FieldAutocompleteProps<T, E> {
  render: (element: E) => ReactNode;
}

export function RlsFieldAutocompleteTemplate<
  T = any,
  E extends Element<T> = Element<T>
>({
  render,
  suggestions,
  children,
  disabled,
  formControl,
  hiddenIcon,
  onSearch,
  onSelect,
  onValue,
  placeholder,
  rlsTheme,
  searching
}: FieldAutocompleteTemplateProps<T, E>) {
  const fieldAutocomplete = useFieldAutocomplete({
    suggestions,
    disabled,
    formControl,
    onSelect,
    onValue
  });

  return (
    <div
      ref={fieldAutocomplete.listControl.contentRef}
      className={renderClassStatus(
        'rls-field-box',
        {
          disabled,
          focused: fieldAutocomplete.listControl.focused,
          selected: !!fieldAutocomplete.listControl.value
        },
        'rls-field-list rls-field-autocomplete'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <label
            className="rls-field-list__control"
            onClick={fieldAutocomplete.onClickControl}
          >
            {fieldAutocomplete.listControl.value ? (
              <span className="rls-field-list__control__description">
                {fieldAutocomplete.listControl.value}
              </span>
            ) : (
              <span className="rls-field-list__control__placeholder">
                {placeholder}
              </span>
            )}
          </label>

          {!hiddenIcon && fieldAutocomplete.listControl.value && (
            <button
              className="rls-field-list__action"
              disabled={disabled}
              onClick={fieldAutocomplete.onClickAction}
            >
              <RlsIcon value="trash-2" />
            </button>
          )}
        </div>
      </div>

      <RlsMessageFormError
        className="rls-field-box__error"
        formControl={formControl}
      />

      <div
        className={renderClassStatus('rls-field-list__suggestions', {
          visible: fieldAutocomplete.listControl.visible,
          hide: !fieldAutocomplete.listControl.visible,
          higher: fieldAutocomplete.listControl.higher
        })}
      >
        <div className="rls-field-list__suggestions__body">
          <ul
            ref={fieldAutocomplete.listControl.listRef}
            className="rls-field-list__ul"
          >
            <div className="rls-field-list__ul__search">
              <input
                ref={fieldAutocomplete.listControl.inputRef}
                className="rls-field-list__ul__control"
                type="text"
                placeholder={reactI18n('listInputPlaceholder')}
                value={fieldAutocomplete.pattern}
                onChange={({ target: { value } }) => {
                  fieldAutocomplete.setPattern(value);
                }}
                disabled={disabled || searching}
                onFocus={fieldAutocomplete.onFocusInput}
                onBlur={fieldAutocomplete.onBlurInput}
                onKeyDown={fieldAutocomplete.onKeydownInput}
              />

              {onSearch && (
                <button
                  disabled={disabled || searching}
                  onClick={() => {
                    onSearch(fieldAutocomplete.pattern);
                  }}
                >
                  <RlsIcon value="search" />
                </button>
              )}
            </div>

            {searching && <RlsProgressBar indeterminate={true} />}

            {fieldAutocomplete.coincidences.map((element, index) => (
              <li
                key={index}
                className="rls-field-list__element"
                tabIndex={-1}
                onClick={fieldAutocomplete.onClickElement(element)}
                onKeyDown={fieldAutocomplete.onKeydownElement(element)}
              >
                {render(element)}
              </li>
            ))}

            {!fieldAutocomplete.coincidences.length && (
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
          onClick={fieldAutocomplete.onClickBackdrop}
        ></div>
      </div>
    </div>
  );
}

export function RlsFieldAutocomplete<T = any>(
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
