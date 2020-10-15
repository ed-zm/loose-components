import gql from 'graphql-tag'

export const CREATE_ORGANIZATION = gql`
  mutation createOneOrganization($name: String!, $userId: String!, $stripeId: String!) {
    createOneOrganization(data: {
      name: $name,
      stripeId: $stripeId
      owner: {
        connect: {
          id: $userId
        }
      }
    }) {
      id
      name
      users {
        id
        firstName
        avatar
      }
      teams {
        id
      }
      owner {
        id
      }
    }
  }
`
