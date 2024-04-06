export interface AbstractListElement<T = unknown> {
  description: string;
  value: T;
  compareTo(value: T): boolean;
}

export interface AbstractAutocompleteElement<T = unknown>
  extends AbstractListElement<T> {
  hasCoincidence(pattern: string): boolean;
}

export interface ListElement<T = unknown> extends AbstractListElement<T> {
  title: string;
  code?: string;
  img?: string;
  initials?: string;
  subtitle?: string;
}

export interface AutocompleteElement<T = unknown>
  extends AbstractAutocompleteElement<T> {
  title: string;
  code?: string;
  img?: string;
  initials?: string;
  subtitle?: string;
}

export class ListCollection<T = unknown> {
  constructor(public readonly value: AbstractListElement<T>[]) {}

  public find(element: T): Undefined<AbstractListElement<T>> {
    return this.value.find((current) => current.compareTo(element));
  }
}

export interface DayState {
  value?: number;
  disabled: boolean;
  forbidden: boolean;
  selected: boolean;
}

export interface WeekState {
  days: DayState[];
}

export interface DayRangeState {
  disabled: boolean;
  end: boolean;
  forbidden: boolean;
  source: boolean;
  ranged: boolean;
  value?: number;
}

export interface WeekRangeState {
  days: DayRangeState[];
}

export interface MonthState {
  value: number;
  label: string;
  disabled: boolean;
  selected: boolean;
}

export interface YearState {
  value?: number;
  disabled: boolean;
  selected: boolean;
}
