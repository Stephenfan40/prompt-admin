import { render, screen } from '@testing-library/react';
import App from './App';

test('renders application title', () => {
  render(<App />);
  const titleElement = screen.getByText(/My Application/i);
  expect(titleElement).toBeInTheDocument();
});
