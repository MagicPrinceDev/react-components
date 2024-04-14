import { RefObject, useEffect, useRef, useState } from 'react';

export interface DatatableHook {
  bodyRef: RefObject<HTMLTableSectionElement>;
  scrolleable: boolean;
}

export function useDatatable(): DatatableHook {
  const [scrolleable, setScrolleable] = useState(false);
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    let observer: ResizeObserver;

    if (bodyRef?.current) {
      observer = new ResizeObserver(() => {
        const scrollHeight = bodyRef?.current?.scrollHeight || 0;
        const clientHeight = bodyRef?.current?.clientHeight || 0;

        setScrolleable(scrollHeight > clientHeight);
      });

      observer.observe(bodyRef?.current);
    }

    return () => observer?.disconnect();
  }, []);

  return { bodyRef, scrolleable };
}
