import  { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/")({
  component: CsvImportModule,
  head: () => ({
    meta: [
      {
        title: "Dashboard - FastAPI Cloud",
      },
    ],
  }),
})


interface CsvRow {
  [key: string]: string;
}

export function CsvImportModule() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<CsvRow[] | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<{ [key: string]: string }>({});

  const systemFields = ['Transaction Amount', 'User ID', 'Date', 'Description'];

  // 1. Declare processFileWithProgress inside the component scope
  const processFileWithProgress = (fileObj: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setPreviewData(null);

    // Simulate progress bar
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          
          // Read the file contents
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result as string;
            parseCsv(text);
          };
          reader.readAsText(fileObj);
          
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const parseCsv = (csvText: string) => {
    const lines = csvText.split(/\r\n|\n/);
    if (lines.length === 0) return;

    // Retrieve and trim headers
    const parsedHeaders = lines[0].split(',').map((h) => h.trim());
    setHeaders(parsedHeaders);

    // Grab up to the first 5 data rows
    const rows: CsvRow[] = [];
    for (let i = 1; i < Math.min(lines.length, 6); i++) {
      if (!lines[i]) continue;
      const values = lines[i].split(',');
      const rowData: CsvRow = {};
      
      parsedHeaders.forEach((header, index) => {
        rowData[header] = values[index] || '';
      });
      rows.push(rowData);
    }

    setPreviewData(rows);
  };

  // 2. Used inside the dropzone onDrop callback
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      alert('Unsupported format. Only .csv files are supported.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      alert('File size exceeds the 50MB limit.');
      return;
    }

    setFile(selectedFile);
    processFileWithProgress(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const handleMappingChange = (systemField: string, value: string) => {
    setColumnMapping((prev) => ({
      ...prev,
      [systemField]: value,
    }));
  };

  const handleReset = () => {
    setFile(null);
    setUploadProgress(0);
    setPreviewData(null);
    setColumnMapping({});
    setHeaders([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Import Transactions</h2>

      {!file && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragActive 
              ? 'border-indigo-600 bg-indigo-50/50' 
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/30'
          }`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center justify-center">
            <CloudArrowUpIcon className="h-12 w-12 text-indigo-600 mb-4" />
            <p className="text-base font-medium text-slate-700">
              Drag and drop your transaction CSV file here
            </p>
            <p className="text-sm text-slate-500 mt-1">
              or{' '}
              <span className="text-indigo-600 font-semibold hover:underline">
                Browse Files
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-4">
              Supports .csv files up to 50MB
            </p>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">Uploading file...</span>
            <span className="text-sm font-medium text-indigo-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {previewData && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-emerald-600" /> Upload successful
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium"
            >
              <ArrowPathIcon className="h-4 w-4" /> Import another file
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg mb-6">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {headers.map((h, index) => (
                    <th key={index} className="px-4 py-3 font-medium text-slate-700">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {previewData.slice(0, 5).map((row, rIndex) => (
                  <tr key={rIndex}>
                    {headers.map((h, cIndex) => (
                      <td key={cIndex} className="px-4 py-3 text-slate-600">
                        {row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-sm font-semibold text-slate-700 mb-3">Map Your Columns</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemFields.map((field) => (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-600">{field}</label>
                <select
                  value={columnMapping[field] || ''}
                  onChange={(e) => handleMappingChange(field, e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-md p-2 bg-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Select matching column</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => alert('Proceeding with column mapping: ' + JSON.stringify(columnMapping))}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Confirm Import
            </button>
          </div>
        </div>
      )}
    </div>
  );
}