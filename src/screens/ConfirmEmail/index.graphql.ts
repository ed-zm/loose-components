import gql from 'graphql-tag'

export const CONFIRM_EMAIL = gql`
  mutation confirmEmail($emailVerificationCode: String!) {
    confirmEmail(emailVerificationCode: $emailVerificationCode)
  }
`