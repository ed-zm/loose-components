import gql from 'graphql-tag'

export const SIGN_IN = gql`
  mutation($email: String!, $password: String!) {
    signIn(
      email: $email,
      password: $password
    )
  }
`

export const RESEND_VERIFICATION_EMAIL = gql`
  mutation($email: String!) {
      resendVerificationEmail(email: $email)
  }
`

export const LOGGED_IN = gql`
  query {
    loggedIn {
      id
      firstName
      lastName
      username
    }
  }
`
