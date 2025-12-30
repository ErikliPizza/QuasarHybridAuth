import { ref, nextTick, toRaw, type Ref } from 'vue';

/**
 * Minimal interface describing the table component reference.
 */
export interface TableRef<T> {
  /**
   * The rows in display order after filtering and sorting.
   */
  filteredSortedRows: T[];
}

/**
 * Details provided by QTable's selection event.
 */
interface SelectionDetails<T> {
  rows: readonly T[];
  keys: readonly unknown[];
  added: boolean;
  evt: Event;
}

/**
 * Composable to handle single and range row selection with Shift/Ctrl support.
 *
 * @param tableRef - A ref to the QTable component instance exposing filteredSortedRows.
 * @returns selected state, stored anchor row, and the handleSelection function.
 */
export function useTableSelection<
  T extends { id: string | number }
>(tableRef: Ref<TableRef<T> | null>) {
  /**
   * Currently selected rows.
   */
  const selected = ref<T[]>([]);

  /**
   * Anchor row for shift-based range selection.
   */
  const storedSelectedRow = ref<T | null>(null);

  /**
   * Handles QTable selection events, supporting:
   * - Single click
   * - Ctrl+click toggling
   * - Shift+click range selection
   */
  async function handleSelection(details: SelectionDetails<T>) {
    const { rows, added, evt } = details;

    // Only handle single-row actions
    if (rows.length !== 1) return;
    if (!(evt instanceof MouseEvent)) return;

    // Non-null assertion since rows.length === 1
    const newRow = rows[0]!;
    const oldRow = storedSelectedRow.value;

    // Update anchor on plain click
    if (!evt.shiftKey) {
      storedSelectedRow.value = newRow;
    }

    // Wait for QTable to update its own v-model:selected
    await nextTick();

    if (evt.shiftKey) {
      // Range selection logic
      const tableRows = tableRef.value?.filteredSortedRows ?? [];
      let firstIndex = tableRows.findIndex(r => r.id === oldRow?.id);
      let lastIndex = tableRows.findIndex(r => r.id === newRow.id);

      if (firstIndex < 0) firstIndex = 0;
      if (firstIndex > lastIndex) [firstIndex, lastIndex] = [lastIndex, firstIndex];

      const rangeRows = tableRows.slice(firstIndex, lastIndex + 1);
      // Cast to T[] explicitly
      const currentSelection = toRaw(selected.value) as T[];

      if (added) {
        const currentIds = new Set(currentSelection.map(r => r.id));
        const toAdd = rangeRows.filter(r => !currentIds.has(r.id));
        selected.value = [...currentSelection, ...toAdd];
      } else {
        const rangeIds = new Set(rangeRows.map(r => r.id));
        selected.value = currentSelection.filter(r => !rangeIds.has(r.id));
      }
    } else if (!evt.ctrlKey && added) {
      // Plain click to select single row
      selected.value = [newRow];
    } else if (!evt.ctrlKey && !added) {
      // Plain click on checked to clear
      selected.value = [];
      storedSelectedRow.value = null;
    }
  }

  return {
    selected,
    handleSelection,
  };
}
