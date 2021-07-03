import gql from 'graphql-tag';

export const typeDefs = gql`
  directive @auth on FIELD_DEFINITION
`;
