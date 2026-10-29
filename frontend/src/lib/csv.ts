const BYTE_ORDER_MARK = String.fromCharCode(0xfeff);
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

function escapeCell(value: string | number) {
  const text = String(value);
  const safe = FORMULA_PREFIX.test(text) ? `'${text}` : text;
  return /[";\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function downloadCsv(
  fileName: string,
  rows: Array<Array<string | number>>,
) {
  const content =
    BYTE_ORDER_MARK + rows.map((row) => row.map(escapeCell).join(";")).join("\r\n");
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
