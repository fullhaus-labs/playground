import gql from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    firstName: NonEmptyString!
    lastName: NonEmptyString!
    emailAddress: EmailAddress!
  }

  type FindAllUsersData {
    done: Boolean!
    users: [User!]!
  }

  input FindOneUserByIDArgs {
    id: ID!
  }

  type FindOneUserByIDData {
    done: Boolean!
    user: User
  }

  input FindOneUserByEmailAddressArgs {
    emailAddress: EmailAddress!
  }

  type FindOneUserByEmailAddressData {
    done: Boolean!
    user: User
  }

  extend type Query {
    findAllUsers: FindAllUsersData!
    findOneUserByID(input: FindOneUserByIDArgs!): FindOneUserByIDData!
    findOneUserByEmailAddress(
      input: FindOneUserByEmailAddressArgs!
    ): FindOneUserByEmailAddressData!
  }
`;
