import gql from 'graphql-tag'

export const CREATE_ORGANIZATION = gql`
  mutation createOneOrganization($name: String!, $userId: String!) {
    createOneOrganization(data: {
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
