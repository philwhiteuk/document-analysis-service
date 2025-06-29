import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import History, { DocumentSummary } from './History';

const docs: DocumentSummary[] = [
  {
    file_id: 'abc123',
    filename: 'sample.txt',
    uploaded_at: new Date('2025-06-29T12:00:00Z').toISOString(),
  },
  {
    file_id: 'def456',
    filename: 'another.txt',
    uploaded_at: new Date('2025-06-28T09:30:00Z').toISOString(),
  },
];

describe('History component', () => {
  it('renders a list of previous analyses and calls onSelect when a document is clicked', () => {
    const handleSelect = vi.fn();
    render(<History docs={docs} onSelect={handleSelect} />);

    // Heading present
    expect(screen.getByRole('heading', { name: /previous analyses/i })).toBeVisible();

    // Two list items rendered
    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    // Click first button
    const firstButton = screen.getByRole('button', { name: /sample.txt/i });
    fireEvent.click(firstButton);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith('abc123');
  });

  it('renders nothing when list is empty', () => {
    const { container } = render(<History docs={[]} onSelect={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
