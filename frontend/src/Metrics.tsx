import React from 'react';

interface MetricsProps {
  metrics: {
    total_word_count: number;
    unique_word_count: number;
    average_sentence_length: number;
    flesch_kincaid_grade_level: number;
    top_10_words: [string, number][];
  };
}

const Metrics: React.FC<MetricsProps> = ({ metrics }) => {
  return (
    <section className="metrics">
      <h2>Analysis Results</h2>
      <table>
        <tbody>
          <tr>
            <th>Total words</th>
            <td>{metrics.total_word_count}</td>
          </tr>
          <tr>
            <th>Unique words</th>
            <td>{metrics.unique_word_count}</td>
          </tr>
          <tr>
            <th>Average sentence length</th>
            <td>{metrics.average_sentence_length}</td>
          </tr>
          <tr>
            <th>Flesch–Kincaid grade</th>
            <td>{metrics.flesch_kincaid_grade_level}</td>
          </tr>
        </tbody>
      </table>

      <h3>Top 10 words</h3>
      <ol className="word-list">
        {metrics.top_10_words.map(([word, count]) => (
          <li key={word}>
            {word}: {count}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Metrics;
