import gql from 'graphql-tag';

export const typeDefs = gql`
  type UserAccount {
    token: JWT!
  }

  input RegisterUserAccountArgs {
    firstName: NonEmptyString!
    lastName: NonEmptyString!
    emailAddress: EmailAddress!
    password: NonEmptyString!
  }

  type RegisterUserAccountData {
    done: Boolean!
    account: UserAccount!
  }

  input AuthenticateUserAccountArgs {
    emailAddress: EmailAddress!
    password: NonEmptyString!
  }

  type AuthenticateUserAccountData {
    done: Boolean!
    account: UserAccount!
  }

  extend type Mutation {
    registerUserAccount(
      input: RegisterUserAccountArgs!
    ): RegisterUserAccountData!
    authenticateUserAccount(
      input: AuthenticateUserAccountArgs!
    ): AuthenticateUserAccountData!
  }
`;
