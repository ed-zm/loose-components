import gql from 'graphql-tag'

export const CREATE_TEAM = gql`
  mutation($organizationId: String!, $name: String!) {
    createOneTeam(data: {
      organization: {
        connect: { id: $organizationId },
      },
      name: $name
    }) {
      id
      name
      users {
        id
        firstName
        avatar
      }
    }
  }
`

export const ORGANIZATIONS = gql`
  query {
    organizations {
      id
      name
    }
  }
`
