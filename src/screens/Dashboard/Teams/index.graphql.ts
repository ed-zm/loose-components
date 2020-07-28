import gql from 'graphql-tag'

export const TEAMS = gql`
  query(
    $nameFilter: String,
    $orderBy: TeamOrderByInput,
    $first: Int,
    $last: Int,
    $skip: Int,
    $before: String,
    $after: String
  ) {
    teams(
      where: {
        name_contains: $nameFilter
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
        cursor
        node {
          id
          name
          users {
            id
            firstName
            avatar
          }
        }
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
      edges {
        node {
          id
          name
        }
      }
    }
  }
`
