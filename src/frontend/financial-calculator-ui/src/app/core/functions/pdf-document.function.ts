import { PdfBlock } from '@core/@types/pdf-block.type';
import {
  PDF_BLOCK_GAP,
  PDF_CHART_HEIGHT,
  PDF_CHART_PIXEL_RATIO,
  PDF_CHART_WIDTH,
  PDF_COLORS,
  PDF_DIVIDER_WIDTH,
  PDF_FACT_DETAIL_HEIGHT,
  PDF_FACT_LABEL_RATIO,
  PDF_FACT_ROW_HEIGHT,
  PDF_FONT,
  PDF_FONT_SIZE,
  PDF_FOOTER_SPACE,
  PDF_FORMAT,
  PDF_HEADER_RULE_GAP,
  PDF_HEADING_MIN_SPACE,
  PDF_IMAGE_COMPRESSION,
  PDF_IMAGE_FORMAT,
  PDF_IMAGE_MIME_TYPE,
  PDF_JPEG_QUALITY,
  PDF_LINE_HEIGHT,
  PDF_LINE_HEIGHT_FACTOR,
  PDF_MARGIN,
  PDF_NOTE_BORDER_WIDTH,
  PDF_NOTE_PADDING,
  PDF_NOTE_RADIUS,
  PDF_ORIENTATION,
  PDF_PAGE_SEPARATOR,
  PDF_POINTS_PER_MM,
  PDF_RULE_WIDTH,
  PDF_TABLE_CELL_PADDING,
  PDF_TEXT_GAP,
  PDF_TEXT_REPLACEMENTS,
  PDF_TONE_STYLES,
  PDF_UNIT
} from '@core/constants/pdf.constant';
import { PdfChartBlock } from '@core/interfaces/pdf-chart-block.interface';
import { PdfFactsBlock } from '@core/interfaces/pdf-facts-block.interface';
import { PdfHeadingBlock } from '@core/interfaces/pdf-heading-block.interface';
import { PdfLibraries } from '@core/interfaces/pdf-libraries.interface';
import { PdfNoteBlock } from '@core/interfaces/pdf-note-block.interface';
import { PdfRenderContext } from '@core/interfaces/pdf-render-context.interface';
import { PdfReport } from '@core/interfaces/pdf-report.interface';
import { PdfTableBlock } from '@core/interfaces/pdf-table-block.interface';

export function toPdfText(text: string): string {
  return PDF_TEXT_REPLACEMENTS.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);
}

export function renderPdfReport(libraries: PdfLibraries, report: PdfReport): Blob {
  const doc = new libraries.jsPDF({ unit: PDF_UNIT, format: PDF_FORMAT, orientation: PDF_ORIENTATION, compress: true });
  const context: PdfRenderContext = { doc, libraries, y: PDF_MARGIN };

  renderHeader(context, report);
  report.blocks.forEach(block => renderBlock(context, block));
  renderFooters(context, report);

  return doc.output('blob');
}

function contentWidth(context: PdfRenderContext): number {
  return context.doc.internal.pageSize.getWidth() - PDF_MARGIN * 2;
}

function rightEdge(context: PdfRenderContext): number {
  return context.doc.internal.pageSize.getWidth() - PDF_MARGIN;
}

function ensureSpace(context: PdfRenderContext, height: number): void {
  const limit = context.doc.internal.pageSize.getHeight() - PDF_MARGIN - PDF_FOOTER_SPACE;
  if (context.y + height > limit) {
    context.doc.addPage();
    context.y = PDF_MARGIN;
  }
}

function setText(context: PdfRenderContext, size: number, color: string, style = 'normal'): void {
  context.doc.setFont(PDF_FONT, style);
  context.doc.setFontSize(size);
  context.doc.setTextColor(color);
}

function wrap(context: PdfRenderContext, text: string, width: number): string[] {
  return context.doc.splitTextToSize(toPdfText(text), width);
}

function lineHeightFor(fontSize: number): number {
  return fontSize * PDF_LINE_HEIGHT_FACTOR / PDF_POINTS_PER_MM;
}

function writeLines(context: PdfRenderContext, lines: string[], x: number): void {
  context.doc.text(lines, x, context.y, { baseline: 'top', lineHeightFactor: PDF_LINE_HEIGHT_FACTOR });
  context.y += lines.length * lineHeightFor(context.doc.getFontSize());
}

function renderHeader(context: PdfRenderContext, report: PdfReport): void {
  setText(context, PDF_FONT_SIZE.title, PDF_COLORS.text, 'bold');
  writeLines(context, wrap(context, report.title, contentWidth(context)), PDF_MARGIN);
  context.y += PDF_TEXT_GAP;
  setText(context, PDF_FONT_SIZE.body, PDF_COLORS.muted);
  writeLines(context, wrap(context, report.subtitle, contentWidth(context)), PDF_MARGIN);
  setText(context, PDF_FONT_SIZE.small, PDF_COLORS.muted);
  writeLines(context, wrap(context, report.generatedOn, contentWidth(context)), PDF_MARGIN);
  context.y += PDF_HEADER_RULE_GAP / 2;
  context.doc.setDrawColor(PDF_COLORS.primary);
  context.doc.setLineWidth(PDF_RULE_WIDTH);
  context.doc.line(PDF_MARGIN, context.y, rightEdge(context), context.y);
  context.y += PDF_HEADER_RULE_GAP;
}

function renderBlock(context: PdfRenderContext, block: PdfBlock): void {
  switch (block.kind) {
    case 'heading':
      return renderHeading(context, block);
    case 'facts':
      return renderFacts(context, block);
    case 'note':
      return renderNote(context, block);
    case 'table':
      return renderTable(context, block);
    case 'chart':
      return renderChart(context, block);
  }
}

function renderHeading(context: PdfRenderContext, block: PdfHeadingBlock): void {
  const description = block.description ? wrap(context, block.description, contentWidth(context)) : [];
  ensureSpace(context, PDF_LINE_HEIGHT * description.length + PDF_HEADING_MIN_SPACE);
  context.y += PDF_BLOCK_GAP / 2;
  setText(context, PDF_FONT_SIZE.heading, PDF_COLORS.text, 'bold');
  writeLines(context, wrap(context, block.title, contentWidth(context)), PDF_MARGIN);
  context.y += PDF_TEXT_GAP;
  if (description.length > 0) {
    setText(context, PDF_FONT_SIZE.small, PDF_COLORS.muted);
    writeLines(context, description, PDF_MARGIN);
  }
  context.y += PDF_TEXT_GAP;
}

function renderFacts(context: PdfRenderContext, block: PdfFactsBlock): void {
  const labelWidth = contentWidth(context) * PDF_FACT_LABEL_RATIO;
  for (const fact of block.facts) {
    const label = wrap(context, fact.label, labelWidth);
    const rowHeight = Math.max(PDF_FACT_ROW_HEIGHT, label.length * PDF_LINE_HEIGHT + PDF_TEXT_GAP)
      + (fact.detail ? PDF_FACT_DETAIL_HEIGHT : 0);
    ensureSpace(context, rowHeight);
    const top = context.y + PDF_TEXT_GAP;

    setText(context, PDF_FONT_SIZE.body, PDF_COLORS.muted);
    context.doc.text(label, PDF_MARGIN, top, { baseline: 'top', lineHeightFactor: PDF_LINE_HEIGHT_FACTOR });
    setText(context, PDF_FONT_SIZE.body, PDF_COLORS.text, 'bold');
    context.doc.text(toPdfText(fact.value), rightEdge(context), top, { baseline: 'top', align: 'right' });
    if (fact.detail) {
      setText(context, PDF_FONT_SIZE.small, PDF_COLORS.muted);
      context.doc.text(toPdfText(fact.detail), rightEdge(context), top + PDF_LINE_HEIGHT, {
        baseline: 'top',
        align: 'right',
        maxWidth: contentWidth(context)
      });
    }

    context.y += rowHeight;
    context.doc.setDrawColor(PDF_COLORS.border);
    context.doc.setLineWidth(PDF_DIVIDER_WIDTH);
    context.doc.line(PDF_MARGIN, context.y, rightEdge(context), context.y);
  }
  context.y += PDF_BLOCK_GAP;
}

function renderNote(context: PdfRenderContext, block: PdfNoteBlock): void {
  const innerWidth = contentWidth(context) - PDF_NOTE_PADDING * 2;
  setText(context, PDF_FONT_SIZE.heading, PDF_COLORS.text, 'bold');
  const title = block.title ? wrap(context, block.title, innerWidth) : [];
  setText(context, PDF_FONT_SIZE.body, PDF_COLORS.text);
  const text = wrap(context, block.text, innerWidth);
  const height = PDF_NOTE_PADDING * 2
    + title.length * lineHeightFor(PDF_FONT_SIZE.heading)
    + text.length * lineHeightFor(PDF_FONT_SIZE.body)
    + (title.length > 0 ? PDF_TEXT_GAP : 0);
  ensureSpace(context, height);

  const style = PDF_TONE_STYLES[block.tone];
  context.doc.setFillColor(style.fill);
  context.doc.setDrawColor(style.border);
  context.doc.setLineWidth(PDF_NOTE_BORDER_WIDTH);
  context.doc.roundedRect(PDF_MARGIN, context.y, contentWidth(context), height, PDF_NOTE_RADIUS, PDF_NOTE_RADIUS, 'FD');

  const bottom = context.y + height;
  context.y += PDF_NOTE_PADDING;
  if (title.length > 0) {
    setText(context, PDF_FONT_SIZE.heading, PDF_COLORS.text, 'bold');
    writeLines(context, title, PDF_MARGIN + PDF_NOTE_PADDING);
    context.y += PDF_TEXT_GAP;
  }
  setText(context, PDF_FONT_SIZE.body, PDF_COLORS.text);
  writeLines(context, text, PDF_MARGIN + PDF_NOTE_PADDING);
  context.y = bottom + PDF_BLOCK_GAP;
}

function renderTable(context: PdfRenderContext, block: PdfTableBlock): void {
  const columnStyles = Object.fromEntries(block.columns.map((column, index) => [index, { halign: column.align }]));
  context.libraries.autoTable(context.doc, {
    startY: context.y,
    margin: { top: PDF_MARGIN, right: PDF_MARGIN, bottom: PDF_MARGIN + PDF_FOOTER_SPACE, left: PDF_MARGIN },
    head: [block.columns.map(column => toPdfText(column.header))],
    body: block.rows.map(row => row.map(toPdfText)),
    theme: 'striped',
    styles: { font: PDF_FONT, fontSize: PDF_FONT_SIZE.table, cellPadding: PDF_TABLE_CELL_PADDING, textColor: PDF_COLORS.text },
    headStyles: { fillColor: PDF_COLORS.tableHead, textColor: PDF_COLORS.text, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: PDF_COLORS.tableStripe },
    columnStyles,
    didParseCell: data => {
      if (data.section === 'head') {
        data.cell.styles.halign = block.columns[data.column.index]?.align ?? data.cell.styles.halign;
      }
    },
    didDrawPage: data => {
      context.y = data.cursor?.y ?? context.y;
    }
  });
  context.y += PDF_BLOCK_GAP;
}

function renderChart(context: PdfRenderContext, block: PdfChartBlock): void {
  const canvas = document.createElement('canvas');
  canvas.width = PDF_CHART_WIDTH;
  canvas.height = PDF_CHART_HEIGHT;
  const chart = new context.libraries.Chart(canvas, {
    ...block.configuration,
    options: {
      ...block.configuration.options,
      responsive: false,
      animation: false,
      devicePixelRatio: PDF_CHART_PIXEL_RATIO
    }
  });
  const image = chart.toBase64Image(PDF_IMAGE_MIME_TYPE, PDF_JPEG_QUALITY);
  chart.destroy();

  const width = contentWidth(context);
  const height = width * PDF_CHART_HEIGHT / PDF_CHART_WIDTH;
  ensureSpace(context, height);
  context.doc.addImage(image, PDF_IMAGE_FORMAT, PDF_MARGIN, context.y, width, height, undefined, PDF_IMAGE_COMPRESSION);
  context.y += height + PDF_BLOCK_GAP;
}

function renderFooters(context: PdfRenderContext, report: PdfReport): void {
  const pages = context.doc.getNumberOfPages();
  const footerY = context.doc.internal.pageSize.getHeight() - PDF_MARGIN;
  for (let page = 1; page <= pages; page++) {
    context.doc.setPage(page);
    setText(context, PDF_FONT_SIZE.small, PDF_COLORS.muted);
    context.doc.text(toPdfText(report.title), PDF_MARGIN, footerY, { baseline: 'top' });
    context.doc.text(`${page}${PDF_PAGE_SEPARATOR}${pages}`, rightEdge(context), footerY, { baseline: 'top', align: 'right' });
  }
}
