import gql from 'graphql-tag'

export const TEAMS = gql`
  query {
    teams {
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
      id
      name
    }
  }
`
