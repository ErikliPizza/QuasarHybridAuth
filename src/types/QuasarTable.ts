import type { Component } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface QTableColumn<T extends Record<string, any>> {
  name: string;
  label: string;
  required?: boolean;
  align?: 'left' | 'center' | 'right';
  field: string | ((row: T) => unknown);
  format?: (val: unknown, row: T) => string;
  sortable?: boolean;
  component?: Component;
}

export interface QTablePagination {
  descending: boolean;
  page: number;
  rowsNumber?: number;
  rowsPerPage: number;
  sortBy: string;
}
export interface FilterItem {
  type: 'text' | 'select';
  key: string | number;
  label: string;
  value?: string | number | null | undefined;
  options?: object[];
}

export interface SpatieParams {
  page: number;
  rowsPerPage?: number;
  sort?: string;
  // allow any other string-keyed params (e.g. filter[name], filter[age], etc.)
  filter: Record<string, string>;
}

export interface DataTableRef {
  refresh: () => void;
}