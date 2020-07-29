import gql from 'graphql-tag'

export const CREATE_ORGANIZATION = gql`
  mutation createOrganization($name: String!, $userId: ID!) {
    createOrganization(data: {
      name: $name,
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
