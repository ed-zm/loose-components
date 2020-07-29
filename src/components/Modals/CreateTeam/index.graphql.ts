import gql from 'graphql-tag'

export const CREATE_TEAM = gql`
  mutation($organizationId: ID!, $name: String!) {
    createTeam(data: {
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
      edges {
        node {
          id
          name
        }
      }
    }
  }
`
