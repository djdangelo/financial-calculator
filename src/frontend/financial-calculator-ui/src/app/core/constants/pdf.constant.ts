import { PdfTone } from '@core/@types/pdf-tone.type';
import { PdfToneStyle } from '@core/interfaces/pdf-tone-style.interface';

export const PDF_UNIT = 'mm';
export const PDF_FORMAT = 'a4';
export const PDF_ORIENTATION = 'portrait';
export const PDF_FONT = 'helvetica';
export const PDF_MARGIN = 14;
export const PDF_FOOTER_SPACE = 10;
export const PDF_BLOCK_GAP = 5;
export const PDF_LINE_HEIGHT = 4.6;

export const PDF_FONT_SIZE = {
  title: 18,
  heading: 12,
  body: 9.5,
  small: 8,
  table: 8
};

export const PDF_COLORS = {
  text: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',
  primary: '#047857',
  tableHead: '#f1f5f9',
  tableStripe: '#f8fafc'
};

export const PDF_TONE_STYLES: Record<PdfTone, PdfToneStyle> = {
  neutral: { fill: '#f8fafc', border: '#e2e8f0' },
  positive: { fill: '#ecfdf5', border: '#a7f3d0' },
  warning: { fill: '#fffbeb', border: '#fde68a' },
  negative: { fill: '#fef2f2', border: '#fecaca' }
};

export const PDF_NOTE_PADDING = 4;
export const PDF_NOTE_RADIUS = 2;
export const PDF_FACT_ROW_HEIGHT = 6.4;
export const PDF_FACT_DETAIL_HEIGHT = 4;
export const PDF_TABLE_CELL_PADDING = 1.6;
export const PDF_HEADER_RULE_GAP = 4;

export const PDF_CHART_WIDTH = 1200;
export const PDF_CHART_HEIGHT = 520;
export const PDF_CHART_PIXEL_RATIO = 1;
export const PDF_IMAGE_FORMAT = 'PNG';
export const PDF_IMAGE_MIME_TYPE = 'image/png';

export const PDF_MIME_TYPE = 'application/pdf';
export const PDF_FILE_EXTENSION = '.pdf';
export const PDF_STANDALONE_QUERY = '(display-mode: standalone)';
export const PDF_SHARE_ABORT_ERROR = 'AbortError';
export const PDF_URL_REVOKE_DELAY_MS = 30000;
export const PDF_PAGE_SEPARATOR = ' / ';

export const PDF_TEXT_REPLACEMENTS: readonly [RegExp, string][] = [
  [/[\u00a0\u202f]/g, ' '],
  [/\u2212/g, '-']
];

export const PDF_ERROR_SUMMARY_KEY = 'shared.pdf.error_title';
export const PDF_ERROR_DETAIL_KEY = 'shared.pdf.error';

export const PDF_LINE_HEIGHT_FACTOR = 1.35;
export const PDF_TEXT_GAP = 1.5;
export const PDF_RULE_WIDTH = 0.6;
export const PDF_DIVIDER_WIDTH = 0.2;
export const PDF_NOTE_BORDER_WIDTH = 0.3;
export const PDF_FACT_LABEL_RATIO = 0.6;
export const PDF_JPEG_QUALITY = 1;
export const PDF_HEADING_MIN_SPACE = 22;
export const PDF_POINTS_PER_MM = 72 / 25.4;
export const PDF_IMAGE_COMPRESSION = 'FAST';
