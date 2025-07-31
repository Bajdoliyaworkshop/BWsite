import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from '../App';

export { render };

async function render({ Page, contextProps }) {
  const root = document.getElementById('root');
  hydrateRoot(
    root,
    <App>
      <Page {...contextProps} />
    </App>
  );
}