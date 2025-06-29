import { useState, useEffect, useRef } from "react";
import { uploadFile, getHistory, getResults } from "./api";
import Metrics, { MetricsData } from "./Metrics";
import History, { DocumentSummary } from "./History";

function App() {
  const [file, setFile] = useState<File | null>(null);

  // Auto-upload handler
  async function handleFileSelect(file: File) {
    setFile(file);
    setUploading(true);
    setMessage(null);
    try {
      const res = await uploadFile(file);
      setMessage(`Uploaded! File ID: ${res.file_id}`);
      setMetrics(res.metrics);
      // refresh history
      const docs = await getHistory();
      setHistory(docs);
    } catch (err: any) {
      setMessage(err?.response?.data?.detail ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [history, setHistory] = useState<DocumentSummary[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setMessage(err?.response?.data?.detail ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  // Drag-and-drop handlers
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }
  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
      // Optionally, update the hidden input for accessibility
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
    }
  }
  // Clicking the dropzone focuses the file input
  function handleDropzoneClick() {
    fileInputRef.current?.click();
  }

  return (
    <main className="container">
      <h1>Document Analysis Service</h1>
      <form onSubmit={handleSubmit}>
        <div
          className={`dropzone${dragActive ? " drag-active" : ""}`}
          onClick={handleDropzoneClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          tabIndex={0}
          aria-label="File dropzone"
          role="button"
        >
          <p>Drag & drop your .txt file here, or click to select</p>
        </div>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          disabled={uploading}
          style={{ display: "none" }}
          ref={fileInputRef}
        />
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
