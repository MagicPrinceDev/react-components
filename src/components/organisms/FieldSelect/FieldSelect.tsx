import {
  AbstractListElement as Element,
  ListElement
} from '@rolster/helpers-components';
import { ReactControl } from '@rolster/react-forms';
import { ReactNode } from 'react';
import reactI18n from '../../../i18n';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsBallot, RlsMessageFormError } from '../../molecules';
import { useFieldSelect } from './FieldSelectHook';
import './FieldSelect.css';

interface FieldSelectProps<T = unknown, E extends Element<T> = Element<T>>
  extends RlsComponent {
  suggestions: E[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, T>;
  placeholder?: string;
  onSelect?: (value: T) => void;
  onValue?: (value?: T) => void;
}

interface FieldSelectTemplateProps<
  T = unknown,
  E extends Element<T> = Element<T>
> extends FieldSelectProps<T, E> {
  render: (element: E) => ReactNode;
}

export function RlsFieldSelectTemplate<
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
}: FieldSelectTemplateProps<T, E>) {
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
  } = useFieldSelect({
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
        { focused: listControl.focused, disabled },
        'rls-field-list rls-field-select'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <input
            ref={listControl.inputRef}
            className="rls-field-list__control"
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
            className={renderClassStatus('rls-field-list__action', {
              visible: listControl.visible
            })}
            disabled={disabled}
            onClick={onClickAction}
          >
            <RlsIcon value="arrow-ios-down" />
          </button>
        </div>
      </div>

      <RlsMessageFormError
        className="rls-field-box__error"
        formControl={formControl}
      />

      <div
        className={renderClassStatus('rls-field-list__suggestions', {
          visible: listControl.visible,
          hide: !listControl.visible,
          higher: listControl.higher
        })}
      >
        <div className="rls-field-list__suggestions__body">
          <ul ref={listControl.listRef} className="rls-field-list__ul">
            {suggestions.map((element, index) => (
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

            {!suggestions.length && (
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

export function RlsFieldSelect<T = unknown>(
  props: FieldSelectProps<T, ListElement<T>>
) {
  return (
    <RlsFieldSelectTemplate
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
