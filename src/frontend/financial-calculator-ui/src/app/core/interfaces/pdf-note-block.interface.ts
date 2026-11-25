import { PdfTone } from '@core/@types/pdf-tone.type';

export interface PdfNoteBlock {
  kind: 'note';
  tone: PdfTone;
  title: string;
  text: string;
}
