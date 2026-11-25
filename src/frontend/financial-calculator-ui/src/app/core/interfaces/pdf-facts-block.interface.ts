import { PdfFact } from './pdf-fact.interface';

export interface PdfFactsBlock {
  kind: 'facts';
  facts: PdfFact[];
}
