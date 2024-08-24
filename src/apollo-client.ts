// src/apollo-client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://tapme-telegram.onrender.com/graphql',
  cache: new InMemoryCache(),
});

export default client;