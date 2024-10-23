import {
  AbstractListElement,
  ListCollection,
  navigationListFromElement,
  navigationListFromInput,
  locationListCanTop
} from '@rolster/components';
import { ReactControl } from '@rolster/react-forms';
import { KeyboardEvent, RefObject, useEffect, useRef, useState } from 'react';

interface ListControlState<T> {
  collection: ListCollection<T>;
  focused: boolean;
  higher: boolean;
  value: string;
  visible: boolean;
}

export interface ListControl<T = any> extends ListControlState<T> {
  contentRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  listRef: RefObject<HTMLUListElement>;
  navigationElement: (event: KeyboardEvent) => void;
  navigationInput: (event: KeyboardEvent) => void;
  setFocused: (focused: boolean) => void;
  setValue: (value: string) => void;
  setVisible: (visible: boolean) => void;
}

interface ListControlProps<T = any> {
  suggestions: AbstractListElement<T>[];
  formControl?: ReactControl<HTMLElement, T | undefined>;
}

export function useListControl<T = any>({
  suggestions,
  formControl
}: ListControlProps<T>): ListControl<T> {
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<ListControlState<T>>({
    collection: new ListCollection<T>([]),
    focused: false,
    higher: false,
    value: '',
    visible: false
  });

  const position = useRef(0);

  useEffect(() => {
    function onCloseSuggestions({ target }: MouseEvent) {
      if (!contentRef?.current?.contains(target as any)) {
        setState((state) => ({ ...state, visible: false }));
      }
    }

    document.addEventListener('click', onCloseSuggestions);

    return () => {
      document.removeEventListener('click', onCloseSuggestions);
    };
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    const list = listRef.current;

    formControl?.touch();

    setState((state) => ({
      ...state,
      higher: locationListCanTop(content, list)
    }));
  }, [state.visible]);

  useEffect(() => {
    setState((state) => ({
      ...state,
      collection: new ListCollection(suggestions)
    }));
  }, [suggestions]);

  function setFocused(focused: boolean): void {
    setState((state) => ({ ...state, focused }));
  }

  function setValue(value: string): void {
    setState((state) => ({ ...state, value }));
  }

  function setVisible(visible: boolean): void {
    setState((state) => ({ ...state, visible }));
  }

  function navigationInput(event: KeyboardEvent): void {
    if (state.visible) {
      const newPosition = navigationListFromInput({
        content: contentRef.current,
        event: event as any,
        list: listRef.current
      });

      position.current = newPosition || 0;
    }
  }

  function navigationElement(event: KeyboardEvent): void {
    position.current = navigationListFromElement({
      content: contentRef.current,
      event: event as any,
      input: inputRef.current,
      list: listRef.current,
      position: position.current
    });
  }

  return {
    ...state,
    contentRef,
    inputRef,
    listRef,
    navigationElement,
    navigationInput,
    setFocused,
    setValue,
    setVisible
  };
}
