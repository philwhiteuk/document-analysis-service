import React from 'react';

export interface DocumentSummary {
  file_id: string;
  filename: string;
  uploaded_at: string;
}

interface HistoryProps {
  docs: DocumentSummary[];
  onSelect: (fileId: string) => void;
}

const History: React.FC<HistoryProps> = ({ docs, onSelect }) => {
  if (docs.length === 0) {
    return null;
  }

  return (
    <section className="history">
      <h2>Previous Analyses</h2>
      <ul>
        {docs.map((doc) => (
          <li key={doc.file_id}>
            <button type="button" onClick={() => onSelect(doc.file_id)}>
              {doc.filename} – {new Date(doc.uploaded_at).toLocaleString()}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default History;
