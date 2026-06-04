import { useQueryClient } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';
import { api } from 'src/boot/axios';
import type { ApiCollectionResponse } from 'src/boot/axios';
import type { SearchOption, SearchParamValue } from 'src/types/searchOptions';

interface UseSearchOptionsFiltersArgs {
  endpoint: MaybeRefOrGetter<string>;
  searchKey: MaybeRefOrGetter<string>;
  /** Resource field used as the option label (index endpoints have no `label`). */
  labelKey: MaybeRefOrGetter<string>;
  /** Extra `filter[key]=value` pairs merged into every request; empty values are skipped. */
  filters?: MaybeRefOrGetter<Record<string, SearchParamValue> | undefined>;
}

function toFilterQueryKey(key: string): string {
  const trimmed = key.trim();
  return trimmed.startsWith('filter[') ? trimmed : `filter[${trimmed}]`;
}

function appendFilterParam(
  params: Record<string, SearchParamValue>,
  key: string | undefined,
  value: SearchParamValue | undefined,
) {
  if (!key || value == null || value === '') return;
  params[toFilterQueryKey(key)] = value;
}

export function useSearchOptionsFilters(args: UseSearchOptionsFiltersArgs) {
  const queryClient = useQueryClient();

  function buildSearchParams(searchValue: string): Record<string, SearchParamValue> {
    const params: Record<string, SearchParamValue> = {
      [toFilterQueryKey(toValue(args.searchKey))]: searchValue,
    };

    const filters = args.filters ? toValue(args.filters) : undefined;
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        appendFilterParam(params, key, value);
      }
    }

    return params;
  }

  async function fetchOptions(searchValue: string): Promise<SearchOption[]> {
    const params = buildSearchParams(searchValue);
    const endpoint = toValue(args.endpoint);
    const labelKey = toValue(args.labelKey);

    return queryClient.fetchQuery({
      queryKey: ['search-options', endpoint, labelKey, params],
      queryFn: async () => {
        const { data } = await api.get<
          ApiCollectionResponse<{ id: number } & Record<string, string | number | boolean | null>>
        >(endpoint, { params });
        // Index endpoints return full resources without a `label`; derive it here.
        return (data.data ?? []).map((item) => ({
          ...item,
          label: item[labelKey] == null ? '' : String(item[labelKey]),
        }));
      },
      staleTime: 60_000,
    });
  }

  return { buildSearchParams, fetchOptions };
}
