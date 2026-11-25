import { PdfChartBlock } from '@core/interfaces/pdf-chart-block.interface';
import { PdfFactsBlock } from '@core/interfaces/pdf-facts-block.interface';
import { PdfHeadingBlock } from '@core/interfaces/pdf-heading-block.interface';
import { PdfNoteBlock } from '@core/interfaces/pdf-note-block.interface';
import { PdfTableBlock } from '@core/interfaces/pdf-table-block.interface';

export type PdfBlock = PdfHeadingBlock | PdfFactsBlock | PdfNoteBlock | PdfTableBlock | PdfChartBlock;
