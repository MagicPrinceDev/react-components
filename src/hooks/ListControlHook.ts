import { itIsDefined } from '@rolster/helpers-advanced';
import {
  AbstractListElement,
  ListCollection,
  listNavigationElement,
  listNavigationInput,
  locationListIsBottom
} from '@rolster/helpers-components';
import { ReactControl } from '@rolster/react-forms';
import {
  Dispatch,
  KeyboardEvent,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from 'react';

export interface ListControl<T = unknown> {
  boxContentRef: RefObject<HTMLDivElement>;
  collection: ListCollection<T>;
  focused: boolean;
  higher: boolean;
  inputRef: RefObject<HTMLInputElement>;
  listRef: RefObject<HTMLUListElement>;
  value: string;
  visible: boolean;
  navigationElement: (event: KeyboardEvent) => void;
  navigationInput: (event: KeyboardEvent) => void;
  setFocused: Dispatch<SetStateAction<boolean>>;
  setValue: Dispatch<SetStateAction<string>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

interface ListControlProps<T = unknown> {
  suggestions: AbstractListElement<T>[];
  formControl?: ReactControl<HTMLElement, T>;
}

export function useListControl<T = unknown>({
  suggestions,
  formControl
}: ListControlProps<T>): ListControl<T> {
  const boxContentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [collection, setCollection] = useState(new ListCollection<T>([]));
  const [value, setValue] = useState('');
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(false);
  const [higher, setHigher] = useState(false);
  const [focused, setFocused] = useState(false);

  const position = useRef(0);

  useEffect(() => {
    function onCloseSuggestions({ target }: MouseEvent) {
      if (!boxContentRef?.current?.contains(target as any)) {
        setVisible(false);
      }
    }

    document.addEventListener('click', onCloseSuggestions);

    return () => {
      document.removeEventListener('click', onCloseSuggestions);
    };
  }, []);

  useEffect(() => {
    if (visible && !opened) {
      setOpened(true);
    }

    if (!visible && opened && !!formControl?.touched) {
      formControl.touch();
    }

    setHigher(!locationListIsBottom(boxContentRef.current, listRef.current));
  }, [visible]);

  useEffect(() => {
    setCollection(new ListCollection(suggestions));
  }, [suggestions]);

  function navigationInput(event: KeyboardEvent): void {
    if (visible) {
      const newPosition = listNavigationInput({
        contentElement: boxContentRef.current,
        event: event as any,
        listElement: listRef.current
      });

      position.current = itIsDefined(newPosition) ? newPosition : 0;
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
    boxContentRef,
    collection,
    focused,
    higher,
    inputRef,
    listRef,
    navigationElement,
    navigationInput,
    setFocused,
    setValue,
    setVisible,
    value,
    visible
  };
}
