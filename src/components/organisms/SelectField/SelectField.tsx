import { ReactControl } from '@rolster/react-forms';
import { ReactNode } from 'react';
import reactI18n from '../../../i18n';
import { AbstractListElement as Element, ListElement } from '../../../models';
import { renderClassStatus } from '../../../utils/css';
import { RlsMessageIcon, RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsBallot } from '../../molecules';
import { useSelectField } from './select-field.hook';
import './SelectField.css';

interface SelectFieldProps<T = unknown, E extends Element<T> = Element<T>>
  extends RlsComponent {
  suggestions: E[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, T>;
  placeholder?: string;
  onSelect?: (value: T) => void;
  onValue?: (value?: T) => void;
}

interface SelectFieldTemplateProps<
  T = unknown,
  E extends Element<T> = Element<T>
> extends SelectFieldProps<T, E> {
  render: (element: E) => ReactNode;
}

export function RlsSelectFieldTemplate<
  T = unknown,
  E extends Element<T> = Element<T>
>({
  suggestions,
  children,
  disabled,
  formControl,
  placeholder,
  rlsTheme,
  onSelect,
  onValue,
  render
}: SelectFieldTemplateProps<T, E>) {
  const {
    listControl,
    onBlurInput,
    onClickAction,
    onClickBackdrop,
    onClickElement,
    onClickInput,
    onFocusInput,
    onKeydownElement,
    onKeydownInput
  } = useSelectField({
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
        { focused: listControl.focused, disabled },
        'rls-select-field rls-list-field'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-box-field__label">{children}</label>}

      <div className="rls-box-field__component">
        <div className="rls-box-field__body">
          <input
            ref={listControl.inputRef}
            className="rls-list-field__control"
            readOnly={true}
            disabled={disabled}
            placeholder={placeholder}
            value={listControl.value}
            onFocus={onFocusInput}
            onBlur={onBlurInput}
            onClick={onClickInput}
            onKeyDown={onKeydownInput}
          />
          <button
            className={renderClassStatus('rls-list-field__action', {
              visible: listControl.visible
            })}
            disabled={disabled}
            onClick={onClickAction}
          >
            <RlsIcon value="arrow-ios-down" />
          </button>
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
            {suggestions.map((element, index) => (
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

            {!suggestions.length && (
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

export function RlsSelectField<T = unknown>(
  props: SelectFieldProps<T, ListElement<T>>
) {
  return (
    <RlsSelectFieldTemplate
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
