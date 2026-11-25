import { PdfTableColumn } from './pdf-table-column.interface';

export interface PdfTableBlock {
  kind: 'table';
  columns: PdfTableColumn[];
  rows: string[][];
}
