import gql from 'graphql-tag'

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

export const ORGANIZATION_MEMBERS = gql`
  query organizationMembers(
    $organizationId: ID!,
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
        }
      }
    }
  }
`
