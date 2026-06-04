import { computed } from 'vue';
import type { QTableColumn } from 'src/types/quasarTable';

interface SavedSettings {
  order: string[];
  visibility: string[];
}

export interface TableSettings<T extends Record<string, unknown>> {
  draggableColumns: QTableColumn<T>[];
  visibleColumnNames: string[];
}

/**
 * Composable for managing table column settings persistence
 *
 * @param tableId Unique identifier for the table
 * @param defaultColumns Default column configuration (used for mapping when loading)
 * @returns Functions for saving and loading table settings
 */
export function useTableSettings<T extends Record<string, unknown> & { id: string | number }>(
  tableId: string,
  defaultColumns: QTableColumn<T>[],
) {
  // Generate the localStorage key based on tableId
  const storageKey = computed(() => `tableSettings-${tableId}`);

  /**
   * Save current table settings to localStorage
   *
   * @param settings The current table settings (ordered columns and visibility)
   */
  const saveSettings = (settings: TableSettings<T>) => {
    try {
      const dataToSave: SavedSettings = {
        order: settings.draggableColumns.map((col) => col.name),
        visibility: settings.visibleColumnNames,
      };
      localStorage.setItem(storageKey.value, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Failed to save table settings to localStorage:', e);
    }
  };

  /**
   * Load table settings from localStorage
   *
   * @returns The loaded settings or null if no settings found or error
   */
  const loadSettings = (): TableSettings<T> | null => {
    try {
      const saved = localStorage.getItem(storageKey.value);
      if (!saved) return null;

      const loadedSettings = JSON.parse(saved) as SavedSettings;

      // Basic validation
      if (
        !loadedSettings ||
        !Array.isArray(loadedSettings.order) ||
        !Array.isArray(loadedSettings.visibility)
      ) {
        console.warn(`Invalid settings found in localStorage for ${tableId}`);
        localStorage.removeItem(storageKey.value);
        return null;
      }

      // Reconstruct the column objects based on saved names
      const loadedOrderNames = loadedSettings.order;
      const originalColumnsMap = new Map(defaultColumns.map((col) => [col.name, col]));
      const newDraggableColumns: QTableColumn<T>[] = [];
      const addedNames = new Set<string>();

      // Add columns in the saved order
      loadedOrderNames.forEach((name) => {
        const col = originalColumnsMap.get(name);
        if (col) {
          newDraggableColumns.push(col);
          addedNames.add(name);
        }
      });

      // Add any new columns that weren't in the saved order
      defaultColumns.forEach((col) => {
        if (!addedNames.has(col.name)) {
          newDraggableColumns.push(col);
        }
      });

      return {
        draggableColumns: newDraggableColumns,
        visibleColumnNames: loadedSettings.visibility,
      };
    } catch (e) {
      console.error('Failed to load or parse table settings from localStorage:', e);
      localStorage.removeItem(storageKey.value);
      return null;
    }
  };

  /**
   * Clear saved settings from localStorage
   */
  const clearSettings = () => {
    localStorage.removeItem(storageKey.value);
  };

  return {
    saveSettings,
    loadSettings,
    clearSettings,
    storageKey,
  };
}
