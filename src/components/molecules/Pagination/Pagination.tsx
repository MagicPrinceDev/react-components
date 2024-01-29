import { hasPattern } from '@rolster/helpers-string';
import { useEffect, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms';
import './Pagination.css';

const DEFAULT_COUNT_ELEMENT = 20;
const MIN_NUMBER_PAGE = 1;
const FIRST_PAGE = 0;
const DEFAULT_MAX_VISIBLE = 4;

interface PaginationEvent {
  firstPage: boolean;
  lastPage: boolean;
}

interface PaginationProps<T> {
  elements: T[];
  count?: number;
  filter?: Nulleable<string>;
  onElements?: (elements: T[]) => void;
  onPagination?: (event: PaginationEvent) => void;
}

export interface Page<T> {
  collection: T[];
  count: number;
  index: number;
  maxPage: number;
}

export interface PaginationState {
  active: boolean;
  label: string;
  value: number;
  prev?: PaginationState;
  next?: PaginationState;
}

export function RlsPagination<T>({
  elements,
  count: defaultCount,
  filter,
  onElements,
  onPagination
}: PaginationProps<T>) {
  const count = defaultCount || DEFAULT_COUNT_ELEMENT;

  const [collection, setCollection] = useState<T[]>([]);
  const [index, setIndex] = useState(0);
  const [maxPage, setMaxPage] = useState(calculateMaxPage(elements, count));
  const [paginations, setPaginations] = useState<PaginationState[]>([]);
  const [currentPagination, setCurrentPagination] = useState<PaginationState>();
  const [description, setDescription] = useState('');
  const [firstPage, setFirstPage] = useState(true);
  const [lastPage, setLastPage] = useState(false);

  useEffect(() => {
    refreshFromElements(elements);
  }, [elements]);

  useEffect(() => {
    const isFirstPage = currentPagination?.value === FIRST_PAGE;
    const isLastPage = currentPagination?.value === maxPage - 1;

    setFirstPage(isFirstPage);
    setLastPage(isLastPage);

    if (onPagination) {
      onPagination({ firstPage: isFirstPage, lastPage: isLastPage });
    }
  }, [currentPagination]);

  useEffect(() => {
    refreshFromFilter(filter);
  }, [filter]);

  function onChangeElements(elements: T[]): void {
    if (onElements) {
      onElements(elements);
    }
  }

  function calculateMaxPage(collection: T[], count: number): number {
    return collection.length ? Math.ceil(collection.length / count) : 0;
  }

  function onSelectPagination(pagination: PaginationState): void {
    const { value } = pagination;

    pagination.active = true;
    setIndex(value);
    setCurrentPagination(pagination);

    refreshFromChanged(clonePage({ index: value }));
  }

  function goPagination(pagination: PaginationState): void {
    if (currentPagination) {
      currentPagination.active = false;
    }

    onSelectPagination(pagination);
  }

  function goPreviousPagination(): void {
    if (currentPagination) {
      const { prev, value } = currentPagination;

      if (prev) {
        onSelectPagination(prev);

        currentPagination.active = false;
      } else {
        const prevIndex = value - MIN_NUMBER_PAGE;

        if (prevIndex >= FIRST_PAGE) {
          refreshFromChanged(clonePageFromIndex(prevIndex));
        }
      }
    }
  }

  function goFirstPagination(): void {
    if (collection.length) {
      refreshFromChanged(clonePageFromIndex(FIRST_PAGE));
    }
  }

  function goNextPagination(): void {
    if (currentPagination) {
      const { next, value } = currentPagination;

      if (next) {
        onSelectPagination(next);

        currentPagination.active = false;
      } else {
        const nextIndex = value + 1;

        if (nextIndex <= maxPage) {
          refreshFromChanged(clonePageFromIndex(nextIndex));
        }
      }
    }
  }

  function goLastPagination(): void {
    if (collection.length) {
      refreshFromChanged(clonePageFromIndex(maxPage - MIN_NUMBER_PAGE));
    }
  }

  function createPageCollection(props: Page<T>): T[] {
    const { collection, count, index } = props;

    if (collection.length) {
      const finish = (index + MIN_NUMBER_PAGE) * count;
      const start = index * count;

      return collection.slice(start, finish);
    }

    return [];
  }

  function refreshFromElements(elements: T[]): void {
    elements.length
      ? refreshFromChanged(refreshPage(elements, filter))
      : rebootPagination();
  }

  function refreshFromFilter(filter?: Nulleable<string>): void {
    refreshFromChanged(refreshPage(elements, filter));
  }

  function refreshFromChanged(page: Page<T>): void {
    refreshPaginations(page);

    refreshDescription(page);

    onChangeElements(createPageCollection(page));
  }

  function refreshCollection(elements: T[], filter?: Nulleable<string>): T[] {
    const collection = filter
      ? elements.filter((element) =>
          hasPattern(JSON.stringify(element), filter)
        )
      : elements;

    setCollection(collection);

    return collection;
  }

  function refreshMaxPage(collection: T[], count: number): number {
    const maxPage = calculateMaxPage(collection, count);

    setMaxPage(maxPage);

    return maxPage;
  }

  function refreshIndex(collection: T[], currentMaxPage?: number): number {
    const maxPage = currentMaxPage || refreshMaxPage(collection, count);

    if (index < maxPage || index === FIRST_PAGE) {
      return index;
    }

    const newIndex = maxPage - 1;

    setIndex(newIndex);

    return newIndex;
  }

  function refreshDescription(page: Page<T>): void {
    const { collection, count, index } = page;

    const totalCount = elements.length;

    const start = index * count + MIN_NUMBER_PAGE;
    let end = (index + MIN_NUMBER_PAGE) * count;

    if (end > collection.length) {
      end = collection.length;
    }

    setDescription(`${start} - ${end} de ${totalCount}`);
  }

  function refreshPaginations({ index, maxPage }: Page<T>): void {
    let maxPageVisible = index + DEFAULT_MAX_VISIBLE;

    if (maxPageVisible > maxPage) {
      maxPageVisible = maxPage;
    }

    let minIndexPage = maxPageVisible - DEFAULT_MAX_VISIBLE;

    if (minIndexPage < 0) {
      minIndexPage = 0;
    }

    if (minIndexPage > index) {
      minIndexPage = index;
    }

    let prevPagination = undefined;
    const paginations = [];

    for (let i = minIndexPage; i < maxPageVisible; i++) {
      const pagination = createPagination(i, index);

      paginations.push(pagination);

      pagination.prev = prevPagination;

      if (prevPagination) {
        prevPagination.next = pagination;
      }

      prevPagination = pagination;
    }

    setPaginations(paginations);
  }

  function clonePage(pagePartial: Partial<Page<T>>): Page<T> {
    return {
      collection: pagePartial.collection || collection,
      index: typeof pagePartial.index === 'number' ? pagePartial.index : index,
      count: pagePartial.count || count,
      maxPage:
        typeof pagePartial.maxPage === 'number' ? pagePartial.maxPage : maxPage
    };
  }

  function clonePageFromIndex(index: number): Page<T> {
    return clonePage({ index });
  }

  function refreshPage(elements: T[], filter?: Nulleable<string>): Page<T> {
    const collection = refreshCollection(elements, filter);
    const maxPage = refreshMaxPage(collection, count);
    const index = refreshIndex(collection, maxPage);

    return clonePage({ collection, index, maxPage });
  }

  function createPagination(value: number, index: number): PaginationState {
    const active = value === index;

    const pagination = {
      label: (value + 1).toString(),
      value,
      active
    };

    if (active) {
      setCurrentPagination(pagination);
    }

    return pagination;
  }

  function rebootPagination(): void {
    setCollection([]);
    setMaxPage(0);
    setIndex(0);
    setPaginations([]);

    onChangeElements([]);
  }

  return (
    <div className="rls-pagination">
      <div className="rls-pagination__actions">
        <button
          className="rls-pagination__action"
          onClick={goFirstPagination}
          disabled={firstPage}
        >
          <RlsIcon value="arrowhead-left" />
        </button>

        <button
          className="rls-pagination__action"
          onClick={goPreviousPagination}
          disabled={firstPage}
        >
          <RlsIcon value="arrow-ios-left" />
        </button>
      </div>

      <div className="rls-pagination__pages">
        {paginations.map((page, index) => {
          return (
            <div
              key={index}
              className={renderClassStatus('rls-pagination__page', {
                active: page.active
              })}
              onClick={() => {
                goPagination(page);
              }}
            >
              {page.label}
            </div>
          );
        })}
      </div>

      <div className="rls-pagination__description">{description}</div>

      <div className="rls-pagination__actions">
        <button
          className="rls-pagination__action"
          onClick={goNextPagination}
          disabled={lastPage}
        >
          <RlsIcon value="arrow-ios-right" />
        </button>

        <button
          className="rls-pagination__action"
          onClick={goLastPagination}
          disabled={lastPage}
        >
          <RlsIcon value="arrowhead-right" />
        </button>
      </div>
    </div>
  );
}
