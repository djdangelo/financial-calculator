import type { Chart } from 'chart.js';
import type { jsPDF } from 'jspdf';
import type { autoTable } from 'jspdf-autotable';

export interface PdfLibraries {
  jsPDF: typeof jsPDF;
  autoTable: typeof autoTable;
  Chart: typeof Chart;
}
