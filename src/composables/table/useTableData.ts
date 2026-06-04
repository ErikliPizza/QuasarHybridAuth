import { computed, reactive, ref } from 'vue';
import { api } from 'boot/axios';
import type { ApiCollectionResponse } from 'boot/axios';
import type {
  FilterItem,
  QTablePagination,
  SpatieParams,
} from 'src/types/quasarTable';

/**
 * Composable to handle table data fetching, pagination and filtering
 *
 * @param apiUrl - API endpoint URL to fetch data from
 * @param initialSortBy - Initial column to sort by
 * @param initialSortDesc - Whether initial sort is descending
 * @param initialRowsPerPage - Initial number of rows per page
 * @param columnFilters - Array of column filters
 * @returns Table state and methods for data handling
 */

export function useTableData<T extends Record<string, unknown> & { id: string | number }>(
  apiUrl: string,
  initialSortBy: string,
  initialSortDesc: boolean,
  initialRowsPerPage: number,
  columnFilters: FilterItem[],
) {
  const rows = ref<T[]>([]);
  const loading = ref<boolean>(false);

  const paginationState = reactive<QTablePagination>({
    sortBy: initialSortBy,
    descending: initialSortDesc,
    page: 1,
    rowsPerPage: initialRowsPerPage,
    rowsNumber: 10,
  });

  const pagination = computed<QTablePagination>({
    get: () => paginationState,
    set: (val) => Object.assign(paginationState, val),
  });

  const buildRequestParams = ({
    page,
    rowsPerPage,
    sortBy,
    descending,
  }: QTablePagination): SpatieParams => {
    const params: SpatieParams = {
      page: {
        number: page,
        ...(rowsPerPage != null && rowsPerPage > 0 && { size: rowsPerPage }),
      },
      ...(sortBy && { sort: descending ? `-${sortBy}` : sortBy }),
      filter: {},
    };

    columnFilters.forEach((filter) => {
      const raw = filter.value;
      if (raw == null || raw === '') return;
      const key = String(filter.key);
      if (typeof raw === 'number') {
        if (Number.isFinite(raw)) params.filter[key] = String(raw);
        return;
      }
      const t = String(raw).trim();
      if (t) params.filter[key] = t;
    });

    return params;
  };

  const onRequest = async (p: QTablePagination) => {
    try {
      loading.value = true;

      const { data } = await api.get<ApiCollectionResponse<T>>(apiUrl, {
        params: buildRequestParams(p),
      });

      if (data.success) {
        rows.value = data.data ?? [];
        Object.assign(paginationState, p, { rowsNumber: data.meta?.total ?? rows.value.length });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      loading.value = false;
    }
  };

  const onFilterChange = async () => {
    paginationState.page = 1;
    await onRequest(paginationState);
  };

  return {
    rows,
    loading,
    pagination,
    onRequest,
    onFilterChange,
  };
}
