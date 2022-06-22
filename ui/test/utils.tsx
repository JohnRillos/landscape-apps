import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const customRender = (ui: React.ReactElement, options = {}) => {
  const history = createMemoryHistory();

  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <Router location={history.location} navigator={history}>
          {children}
        </Router>
      </QueryClientProvider>
    ),
    ...options,
  });
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };
