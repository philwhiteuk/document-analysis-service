import { useState } from 'react';
import { uploadFile } from './api';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadFile(file);
      setMessage(`Uploaded! File ID: ${res.file_id}`);
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
    </main>
  );
}

export default App;
