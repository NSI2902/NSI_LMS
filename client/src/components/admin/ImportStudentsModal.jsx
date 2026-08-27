import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Loader2, Upload, X } from 'lucide-react';
import { importStudents } from '../../services/adminUserService';

const REQUIRED_COLUMNS = ['first_name', 'last_name', 'email', 'username', 'password'];

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

function parseCsv(text) {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (lines.length < 2) {
    throw new Error('CSV must include a header row and at least one student row.');
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.trim());
  const missingColumns = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));

  if (missingColumns.length) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    return headers.reduce(
      (row, header, valueIndex) => ({
        ...row,
        [header]: values[valueIndex] || '',
        rowNumber: index + 2,
      }),
      {}
    );
  });
}

function validateRows(rows) {
  const seenEmails = new Map();
  const seenUsernames = new Map();

  return rows.map((row) => {
    const normalized = {
      first_name: String(row.first_name || '').trim(),
      last_name: String(row.last_name || '').trim(),
      email: String(row.email || '').trim().toLowerCase(),
      username: String(row.username || '').trim(),
      password: String(row.password || ''),
      rowNumber: row.rowNumber,
    };
    const errors = [];

    REQUIRED_COLUMNS.forEach((field) => {
      if (!normalized[field]) errors.push(`${field} is required`);
    });

    if (normalized.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
      errors.push('Email is invalid');
    }

    if (normalized.username && normalized.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }

    if (normalized.password && normalized.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (normalized.email) {
      if (seenEmails.has(normalized.email)) {
        errors.push(`Duplicate email in CSV (also row ${seenEmails.get(normalized.email)})`);
      } else {
        seenEmails.set(normalized.email, normalized.rowNumber);
      }
    }

    if (normalized.username) {
      const usernameKey = normalized.username.toLowerCase();
      if (seenUsernames.has(usernameKey)) {
        errors.push(`Duplicate username in CSV (also row ${seenUsernames.get(usernameKey)})`);
      } else {
        seenUsernames.set(usernameKey, normalized.rowNumber);
      }
    }

    return { ...normalized, errors, isValid: errors.length === 0 };
  });
}

export default function ImportStudentsModal({ isOpen, onClose, onSuccess }) {
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState([]);
  const [parseError, setParseError] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFileName('');
      setRows([]);
      setParseError('');
      setIsImporting(false);
      setSummary(null);
    }
  }, [isOpen]);

  const preview = useMemo(() => {
    const totalRows = rows.length;
    const validRows = rows.filter((row) => row.isValid).length;
    return {
      totalRows,
      validRows,
      invalidRows: totalRows - validRows,
      invalidDetails: rows.filter((row) => !row.isValid),
    };
  }, [rows]);

  if (!isOpen) return null;

  const handleTemplateDownload = () => {
    const csv = `${REQUIRED_COLUMNS.join(',')}\nRahul,Sharma,rahul.sharma@nsiit.com,rahul01,Password123`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student-import-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    setParseError('');
    setSummary(null);
    setRows([]);

    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setParseError('Please upload a CSV file.');
      return;
    }

    setFileName(file.name);

    try {
      const text = await file.text();
      setRows(validateRows(parseCsv(text)));
    } catch (error) {
      setParseError(error.message || 'Unable to parse CSV file.');
    }
  };

  const handleImport = async () => {
    const validRows = rows.filter((row) => row.isValid);
    if (!validRows.length) return;

    setIsImporting(true);
    setParseError('');

    try {
      const result = await importStudents(
        validRows.map(({ first_name, last_name, email, username, password }) => ({
          first_name,
          last_name,
          email,
          username,
          password,
        }))
      );
      setSummary(result);
      if (result.successfullyImported > 0) onSuccess?.();
    } catch (error) {
      setParseError(error.message || 'Failed to import students.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="my-6 w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_-15px_rgba(15,23,42,0.35)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-600">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 sm:text-lg">Import Students CSV</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Upload student records with required account details.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isImporting}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 px-5 py-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
              <Upload size={28} className="text-indigo-600" />
              <span className="mt-3 text-sm font-semibold text-slate-800">
                {fileName || 'Choose a CSV file'}
              </span>
              <span className="mt-1 text-xs text-slate-500">
                first_name, last_name, email, username, password
              </span>
              <input type="file" accept=".csv,text/csv" onChange={handleFileChange} className="hidden" />
            </label>

            <button
              type="button"
              onClick={handleTemplateDownload}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Download size={16} />
              <span>Download CSV Template</span>
            </button>
          </div>

          {parseError && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-600" />
              <span className="font-medium">{parseError}</span>
            </div>
          )}

          {rows.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  ['Total rows', preview.totalRows, 'bg-slate-50 text-slate-700 border-slate-200'],
                  ['Valid rows', preview.validRows, 'bg-emerald-50 text-emerald-700 border-emerald-200'],
                  ['Invalid rows', preview.invalidRows, 'bg-rose-50 text-rose-700 border-rose-200'],
                ].map(([label, value, className]) => (
                  <div key={label} className={`rounded-xl border px-4 py-3 ${className}`}>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
                    <p className="mt-1 text-2xl font-extrabold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="max-h-72 overflow-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="sticky top-0 bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Row</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Username</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Errors</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {rows.map((row) => (
                        <tr key={row.rowNumber} className="bg-white">
                          <td className="px-4 py-3 text-xs font-semibold text-slate-500">{row.rowNumber}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {row.first_name} {row.last_name}
                          </td>
                          <td className="px-4 py-3 text-xs">{row.email}</td>
                          <td className="px-4 py-3 text-xs">{row.username}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
                                row.isValid
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {row.isValid ? 'Valid' : 'Invalid'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-rose-700">
                            {row.errors.length ? row.errors.join('; ') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {summary && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 size={18} />
                <span>Import Summary</span>
              </div>
              <div className="mt-2 grid gap-2 text-xs sm:grid-cols-3">
                <span>Successfully imported: {summary.successfullyImported}</span>
                <span>Failed: {summary.failed}</span>
                <span>Errors: {summary.errors?.length || 0}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isImporting}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={isImporting || preview.validRows === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span>{isImporting ? 'Importing...' : `Import ${preview.validRows} Valid Students`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
