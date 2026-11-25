import type { jsPDF } from 'jspdf';
import { PdfLibraries } from './pdf-libraries.interface';

export interface PdfRenderContext {
  doc: jsPDF;
  libraries: PdfLibraries;
  y: number;
}
