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
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {docs.map((doc) => (
          <li
            key={doc.file_id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <button
              type="button"
              onClick={() => onSelect(doc.file_id)}
              style={{
                textAlign: 'left',
                flex: 1,
                background: '#1976d2', // Material UI blue
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
                fontSize: '1rem',
                fontWeight: 500,
                boxShadow: '0 1px 2px rgba(25, 118, 210, 0.07)',
              }}
            >
              {doc.filename} – {new Date(doc.uploaded_at).toLocaleString()}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default History;
