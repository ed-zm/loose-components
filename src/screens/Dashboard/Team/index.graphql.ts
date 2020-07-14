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
        username
      }
    }
  }
`

export const TEAM_TASKS = gql`
query($state: Int, $teamId: ID) {
  tasks(where: {
    state: $state,
    team: {
      id: $teamId
    }
  }) {
    id
    title
    description
    estimated
    state
    code
    createdBy {
      id
      firstName
      lastName
      avatar
    }
    organization {
      id
    }
    createdAt
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
