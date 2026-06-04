export type SearchModelValue = number | number[] | null;
export type SearchParamValue = string | number | boolean | null;

export interface SearchOptionsProps {
  label?: string;
  endpoint: string;
  /** Resource field the typed search text is matched against (e.g. `name`). */
  searchKey: string;
  /** Resource field rendered as the dropdown label. Defaults to `searchKey`. */
  optionLabelKey?: string;
  /**
   * Extra filters merged into every search request as `filter[key]=value`.
   * Values are typically reactive (bound to form fields, e.g. `{ 'city.id': form.city_id }`);
   * `null`/`undefined`/`''` entries are skipped. Dotted keys (`city.id`) are supported.
   */
  filters?: Record<string, SearchParamValue>;
  multiple?: boolean;
  errorMessage?: string | undefined;
  disable?: boolean;
  initialOptions?: SearchOption[] | undefined;
}

export interface SearchOption {
  id: number;
  label: string;
  [key: string]: unknown;
}
