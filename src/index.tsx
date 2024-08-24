// src/index.tsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import App from './App';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);
