import type { SearchOption } from 'src/types/searchOptions';

type EntityWithLabelField<K extends string> = { id: number } & Record<
  K,
  string | number | null | undefined
>;

/** One selected row for SearchOptions: single related entity → `[{ id, label }]`. */
export function entityToInitialSearchOptions<
  K extends string,
  T extends EntityWithLabelField<K>,
>(entity: T | null | undefined, labelKey: K): SearchOption[] {
  if (!entity) return [];
  const raw = entity[labelKey];
  return [{ id: entity.id, label: raw == null ? '' : String(raw) }];
}

/** Multi-select initial rows from a list of entities sharing the same label field. */
export function entitiesToInitialSearchOptions<
  K extends string,
  T extends EntityWithLabelField<K>,
>(list: T[] | null | undefined, labelKey: K): SearchOption[] {
  return (
    list?.map((item) => {
      const raw = item[labelKey];
      return { id: item.id, label: raw == null ? '' : String(raw) };
    }) ?? []
  );
}
