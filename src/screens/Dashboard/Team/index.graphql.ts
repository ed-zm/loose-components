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

export const DELETE_TEAM = gql`
  mutation deleteTeam($id: ID!) {
    deleteTeam(
      where: {
        id: $id
      }
    ) {
      id
    }
  }
`

export const TEAM_TASKS = gql`
query(
  $state: Int,
  $teamId: ID,
  $orderBy: TaskOrderByInput,
  $first: Int,
  $last: Int,
  $skip: Int,
  $before: String,
  $after: String
) {
  tasks(
    where: {
      state: $state,
      team: {
        id: $teamId
      }
    },
    first: $first,
    last: $last,
    skip: $skip,
    before: $before,
    after: $after,
    orderBy: $orderBy
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    # aggregate {
    #  count
    # }
    edges {
      # cursor
      node {
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
  }
}
`

export const ORGANIZATION_MEMBERS = gql`
  query organizationMembers(
    $organizationId: ID!, $teamId: ID!,
    $orderBy: UserOrderByInput,
    $first: Int,
    $last: Int,
    $skip: Int,
    $before: String,
    $after: String
  ) {
    users(
      where: {
        teams_none: {
          id: $teamId
        }
        organizations_some: {
          id: $organizationId
        }
      },
      first: $first,
      last: $last,
      skip: $skip,
      before: $before,
      after: $after,
      orderBy: $orderBy
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      # aggregate {
      #  count
      # }
      edges {
        # cursor
        node {
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
    }
  }
`

export const TEAM_MEMBERS = gql`
  query organizationMembers(
    $teamId: ID!,
    $orderBy: UserOrderByInput,
    $first: Int,
    $last: Int,
    $skip: Int,
    $before: String,
    $after: String
  ) {
    users(
      where: {
        teams_some: {
          id: $teamId
        }
      },
      first: $first,
      last: $last,
      skip: $skip,
      before: $before,
      after: $after,
      orderBy: $orderBy
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      # aggregate {
      #  count
      # }
      edges {
        # cursor
        node {
          id
          firstName
          lastName
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
