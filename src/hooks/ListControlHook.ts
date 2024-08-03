import {
  AbstractListElement,
  ListCollection,
  listNavigationElement,
  listNavigationInput,
  locationListIsBottom
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
  boxContentRef: RefObject<HTMLDivElement>;
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
  const boxContentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [listState, setListState] = useState<ListControlState<T>>({
    collection: new ListCollection<T>([]),
    focused: false,
    higher: false,
    value: '',
    visible: false
  });

  const position = useRef(0);

  useEffect(() => {
    function onCloseSuggestions({ target }: MouseEvent) {
      if (!boxContentRef?.current?.contains(target as any)) {
        setListState((state) => ({ ...state, visible: false }));
      }
    }

    document.addEventListener('click', onCloseSuggestions);

    return () => {
      document.removeEventListener('click', onCloseSuggestions);
    };
  }, []);

  useEffect(() => {
    const boxContent = boxContentRef.current;
    const list = listRef.current;

    formControl?.touch();

    setListState((state) => ({
      ...state,
      higher: !locationListIsBottom(boxContent, list)
    }));
  }, [listState.visible]);

  useEffect(() => {
    setListState((state) => ({
      ...state,
      collection: new ListCollection(suggestions)
    }));
  }, [suggestions]);

  function setFocused(focused: boolean): void {
    setListState((state) => ({ ...state, focused }));
  }

  function setValue(value: string): void {
    setListState((state) => ({ ...state, value }));
  }

  function setVisible(visible: boolean): void {
    setListState((state) => ({ ...state, visible }));
  }

  function navigationInput(event: KeyboardEvent): void {
    if (listState.visible) {
      const newPosition = listNavigationInput({
        contentElement: boxContentRef.current,
        event: event as any,
        listElement: listRef.current
      });

      position.current = newPosition || 0;
    }
  }

  function navigationElement(event: KeyboardEvent): void {
    position.current = listNavigationElement({
      contentElement: boxContentRef.current,
      event: event as any,
      inputElement: inputRef.current,
      listElement: listRef.current,
      position: position.current
    });
  }

  return {
    ...listState,
    boxContentRef,
    inputRef,
    listRef,
    navigationElement,
    navigationInput,
    setFocused,
    setValue,
    setVisible
  };
}
