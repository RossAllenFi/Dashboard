import { useState } from 'react';

const ENDPOINT_BY_TYPE = {
  master: '/api/upload/master',
  performance: '/api/upload/performance',
  payments: '/api/upload/payments'
};

export default function FileUploadPanel({ onUploaded }) {
  const [fileType, setFileType] = useState('master');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const upload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(ENDPOINT_BY_TYPE[fileType], {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    setResult(data);
    onUploaded?.();
  };

  return (
    <div className="card">
      <h2>CSV Ingestion</h2>
      <div className="upload-row">
        <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
          <option value="master">Master Loan File</option>
          <option value="performance">Performance Update</option>
          <option value="payments">Payment File</option>
        </select>
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button onClick={upload}>Upload</button>
      </div>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
