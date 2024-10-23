import {
  AbstractListElement as Element,
  ListElement
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { ReactNode } from 'react';
import reactI18n from '../../../i18n';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms';
import { RlsComponent } from '../../definitions';
import { RlsBallot, RlsMessageFormError } from '../../molecules';
import { useFieldSelect } from './FieldSelectHook';
import './FieldSelect.css';

interface FieldSelectProps<T = any, E extends Element<T> = Element<T>>
  extends RlsComponent {
  suggestions: E[];
  disabled?: boolean;
  formControl?: ReactControl<HTMLElement, T | undefined>;
  placeholder?: string;
  onSelect?: (value: T) => void;
  onValue?: (value?: T) => void;
}

interface FieldSelectTemplateProps<T = any, E extends Element<T> = Element<T>>
  extends FieldSelectProps<T, E> {
  render: (element: E) => ReactNode;
}

export function RlsFieldSelectTemplate<
  T = any,
  E extends Element<T> = Element<T>
>({
  render,
  suggestions,
  children,
  disabled,
  formControl,
  onSelect,
  onValue,
  placeholder,
  rlsTheme
}: FieldSelectTemplateProps<T, E>) {
  const fieldSelect = useFieldSelect({
    suggestions,
    disabled,
    formControl,
    onSelect,
    onValue
  });

  return (
    <div
      ref={fieldSelect.listControl.contentRef}
      className={renderClassStatus(
        'rls-field-box',
        { focused: fieldSelect.listControl.focused, disabled },
        'rls-field-list rls-field-select'
      )}
      rls-theme={rlsTheme}
    >
      {children && <label className="rls-field-box__label">{children}</label>}

      <div className="rls-field-box__component">
        <div className="rls-field-box__body">
          <input
            ref={fieldSelect.listControl.inputRef}
            className="rls-field-list__control"
            readOnly={true}
            disabled={disabled}
            placeholder={placeholder}
            value={fieldSelect.listControl.value}
            onFocus={fieldSelect.onFocusInput}
            onBlur={fieldSelect.onBlurInput}
            onClick={fieldSelect.onClickInput}
            onKeyDown={fieldSelect.onKeydownInput}
          />
          <button
            className={renderClassStatus('rls-field-list__action', {
              visible: fieldSelect.listControl.visible
            })}
            disabled={disabled}
            onClick={fieldSelect.onClickAction}
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
          visible: fieldSelect.listControl.visible,
          hide: !fieldSelect.listControl.visible,
          higher: fieldSelect.listControl.higher
        })}
      >
        <div className="rls-field-list__suggestions__body">
          <ul
            ref={fieldSelect.listControl.listRef}
            className="rls-field-list__ul"
          >
            {suggestions.map((element, index) => (
              <li
                key={index}
                className="rls-field-list__element"
                tabIndex={-1}
                onClick={fieldSelect.onClickElement(element)}
                onKeyDown={fieldSelect.onKeydownElement(element)}
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
          onClick={fieldSelect.onClickBackdrop}
        ></div>
      </div>
    </div>
  );
}

export function RlsFieldSelect<T = any>(
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
