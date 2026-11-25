import { PdfBlock } from '@core/@types/pdf-block.type';

export interface PdfReport {
  fileName: string;
  title: string;
  subtitle: string;
  generatedOn: string;
  blocks: PdfBlock[];
}
