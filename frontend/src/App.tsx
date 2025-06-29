import { useState, useEffect } from 'react';
import { uploadFile, getHistory, getResults } from './api';
import Metrics, { MetricsData } from './Metrics';
import History, { DocumentSummary } from './History';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [history, setHistory] = useState<DocumentSummary[]>([]);

  useEffect(() => {
    (async () => {
      const docs = await getHistory();
      setHistory(docs);
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadFile(file);
      setMessage(`Uploaded! File ID: ${res.file_id}`);
      setMetrics(res.metrics);
      // refresh history
      const docs = await getHistory();
      setHistory(docs);
    } catch (err: any) {
      setMessage(err?.response?.data?.detail ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="container">
      <h1>Document Analysis Service</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          disabled={uploading}
        />
        <button type="submit" disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      {history.length > 0 && (
        <History
          docs={history}
          onSelect={async (id: string) => {
            const data = await getResults(id);
            setMetrics(data.metrics);
            setMessage(`Loaded results for ${data.filename}`);
          }}
        />
      )}
      {metrics && <Metrics metrics={metrics} />}
    </main>
  );
}

export default App;
