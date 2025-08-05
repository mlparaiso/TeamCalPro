export interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey: string;
}

export async function syncGoogleSheets(config: GoogleSheetsConfig) {
  const response = await fetch('/api/sync-sheets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to sync Google Sheets');
  }

  return response.json();
}

export function getSpreadsheetIdFromUrl(url: string): string {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : '';
}
