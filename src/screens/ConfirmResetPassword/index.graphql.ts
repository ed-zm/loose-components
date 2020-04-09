import gql from 'graphql-tag'

export const CONFIRM_RESET_PASSWORD = gql`
  mutation confirmResetPassword($resetPasswordCode: String!, $password: String!) {
    confirmResetPassword(resetPasswordCode: $resetPasswordCode, password: $password)
  }
`