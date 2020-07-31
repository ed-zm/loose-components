import gql from 'graphql-tag'

export const TEAMS = gql`
  query(
    $where: TeamWhereInput,
    $orderBy: TeamOrderByInput,
    $first: Int,
    $last: Int,
    $skip: Int,
    $before: String,
    $after: String
  ) {
    teams(
      where: $where,
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
