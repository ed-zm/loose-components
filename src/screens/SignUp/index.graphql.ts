import gql from 'graphql-tag'

export const SIGN_UP = gql`
  mutation($email: String!, $password: String!, $inviteCode: String, $firstName: String!, $lastName: String, $username: String!, $stripeToken: String!, $subscription: String! ) {
    signUp(
      email: $email,
      password: $password,
      firstName: $firstName,
      lastName: $lastName,
      username: $username,
      inviteCode: $inviteCode,
      stripeToken: $stripeToken,
      subscription: $subscription
    )
  }
`
