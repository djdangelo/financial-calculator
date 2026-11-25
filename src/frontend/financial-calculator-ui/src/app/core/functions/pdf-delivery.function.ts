import {
  PDF_MIME_TYPE,
  PDF_SHARE_ABORT_ERROR,
  PDF_STANDALONE_QUERY,
  PDF_URL_REVOKE_DELAY_MS
} from '@core/constants/pdf.constant';
import { StandaloneNavigator } from '@core/interfaces/standalone-navigator.interface';

export function isShareAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === PDF_SHARE_ABORT_ERROR;
}

export async function deliverPdfFile(blob: Blob, fileName: string): Promise<void> {
  const file = new File([blob], fileName, { type: PDF_MIME_TYPE });
  if (!canShareFile(file)) {
    downloadFile(blob, fileName);
    return;
  }
  try {
    await navigator.share({ files: [file], title: fileName });
  } catch (error) {
    if (isShareAbort(error)) {
      return;
    }
    downloadFile(blob, fileName);
  }
}

function isStandaloneDisplay(): boolean {
  return window.matchMedia(PDF_STANDALONE_QUERY).matches || (navigator as StandaloneNavigator).standalone === true;
}

function canShareFile(file: File): boolean {
  return isStandaloneDisplay() && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });
}

function downloadFile(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), PDF_URL_REVOKE_DELAY_MS);
}
