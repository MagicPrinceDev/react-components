import {
  FilterCriteria,
  PageState,
  Pagination,
  PaginationController
} from '@rolster/components';
import { useEffect, useRef, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms';
import './Pagination.css';

interface PaginationEvent<T> {
  firstPage: boolean;
  lastPage: boolean;
  suggestions: T[];
}

interface PaginationProps<T> {
  suggestions: T[];
  count?: number;
  filter?: FilterCriteria<T>;
  onPagination?: (event: PaginationEvent<T>) => void;
}

export function RlsPagination<T>({
  suggestions,
  count,
  filter,
  onPagination
}: PaginationProps<T>) {
  const controller = useRef(new PaginationController({ suggestions, count }));
  const [template, setTemplate] = useState(controller.current.template);

  useEffect(() => {
    controller.current = new PaginationController({
      suggestions,
      count,
      position: template.currentPage.value
    });

    onPagination &&
      onPagination({
        firstPage: controller.current.template.firstPage,
        lastPage: controller.current.template.lastPage,
        suggestions: controller.current.page.collection
      });

    setTemplate(controller.current.template);
  }, [suggestions, count]);

  useEffect(() => {
    refreshPagination(controller.current.filtrable(filter));
  }, [filter]);

  function refreshPagination(pagination?: Pagination<T>): void {
    if (pagination) {
      const { page, template } = pagination;
      const { firstPage, lastPage } = template;

      onPagination &&
        onPagination({
          firstPage,
          lastPage,
          suggestions: page.collection
        });

      setTemplate(template);
    }
  }

  function goToPagination(page: PageState): void {
    refreshPagination(controller.current.goToPage(page));
  }

  function goFirstPagination(): void {
    refreshPagination(controller.current.goFirstPage());
  }

  function goPreviousPagination(): void {
    refreshPagination(controller.current.goPreviousPage());
  }

  function goNextPagination(): void {
    refreshPagination(controller.current.goNextPage());
  }

  function goLastPagination(): void {
    refreshPagination(controller.current.goLastPage());
  }

  return (
    <div className="rls-pagination">
      <div className="rls-pagination__actions">
        <button
          className="rls-pagination__action"
          onClick={goFirstPagination}
          disabled={template.firstPage}
        >
          <RlsIcon value="arrowhead-left" />
        </button>

        <button
          className="rls-pagination__action"
          onClick={goPreviousPagination}
          disabled={template.firstPage}
        >
          <RlsIcon value="arrow-ios-left" />
        </button>
      </div>

      <div className="rls-pagination__pages">
        {template.pages.map((page, index) => {
          return (
            <div
              key={index}
              className={renderClassStatus('rls-pagination__page', {
                active: page.active
              })}
              onClick={() => {
                goToPagination(page);
              }}
            >
              {page.label}
            </div>
          );
        })}
      </div>

      <div className="rls-pagination__description">{template.description}</div>

      <div className="rls-pagination__actions">
        <button
          className="rls-pagination__action"
          onClick={goNextPagination}
          disabled={template.lastPage}
        >
          <RlsIcon value="arrow-ios-right" />
        </button>

        <button
          className="rls-pagination__action"
          onClick={goLastPagination}
          disabled={template.lastPage}
        >
          <RlsIcon value="arrowhead-right" />
        </button>
      </div>
    </div>
  );
}
