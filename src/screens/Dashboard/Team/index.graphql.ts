import gql from 'graphql-tag'

export const TEAM = gql`
  query($id: ID!) {
    team(where: {
      id: $id
    }) {
      id
      name
      organization {
        id
      }
      users {
        id
        firstName
        lastName
      }
    }
  }
`

export const ORGANIZATION_MEMBERS = gql`
  query organizationMembers($organizationId: ID!, $teamId: ID!) {
    users(where: {
      teams_none: {
        id: $teamId
      }
      organizations_some: {
        id: $organizationId
      }
    }) {
      id
      firstName
      lastName
      teams { 
        id
        users {
          id
        }
      }
    }
  }
`

export const ADD_MEMBER = gql`
  mutation addTeamMember($teamId: ID!, $memberId: ID!) {
    updateTeam(
      where: { id: $teamId },
      data: {
        users: {
          connect: {
            id: $memberId
          }
        }
      }
    ) {
      id
      users {
        id
      }
    }
  }
`

export const REMOVE_MEMBER = gql`
  mutation removeTeamMember($teamId: ID!, $memberId: ID!) {
    updateTeam(
      where: { id: $teamId },
      data: {
        users: {
          disconnect: {
            id: $memberId
          }
        }
      }
    ) {
      id
      users {
        id
      }
    }
  }
`