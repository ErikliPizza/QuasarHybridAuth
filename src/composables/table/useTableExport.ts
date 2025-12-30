import { exportFile } from 'quasar';
import type { QTableColumn } from 'src/types/QuasarTable';

/**
 * Wraps a value for CSV export with proper formatting
 */
function wrapCsvValue<T extends Record<string, unknown> & { id: string | number }>(
  val: string,
  formatFn?: (val: unknown, row: T) => string,
  row?: T,
) {
  let formatted = formatFn !== undefined && row !== undefined ? formatFn(val, row) : val;

  formatted = formatted === undefined || formatted === null ? '' : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

/**
 * Composable for table export operations
 */
export function useTableExport<T extends Record<string, unknown> & { id: string | number }>() {
  /**
   * Export table data to CSV file
   * @param columns All table columns configuration
   * @param visibleColumnNames Names of columns to include in export
   * @param data Data to export
   * @param filename Optional filename (defaults to 'table-export.csv')
   */
  const exportToCsv = (
    columns: QTableColumn<T>[],
    visibleColumnNames: string[],
    data: T[],
    filename = 'table-export.csv',
  ) => {
    const visibleColumns = columns.filter((col) => visibleColumnNames.includes(col.name));

    const content = [visibleColumns.map((col) => wrapCsvValue<T>(col.label))]
      .concat(
        data.map((row) =>
          visibleColumns
            .map((col) =>
              wrapCsvValue<T>(
                typeof col.field === 'function'
                  ? String(col.field(row))
                  : String(row[col.field === undefined ? col.name : (col.field as keyof T)]),
                col.format,
                row,
              ),
            )
            .join(','),
        ),
      )
      .join('\r\n');

    exportFile(filename, content, 'text/csv');
  };

  return {
    exportToCsv,
  };
}
