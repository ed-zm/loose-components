import gql from 'graphql-tag'

export const USERS = gql`
  query(
    $where: UserWhereInput,
    $orderBy: UserOrderByInput,
    $first: Int,
    $last: Int,
    $skip: Int,
    $before: String,
    $after: String
  ) {
    users(
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
          firstName
          lastName
        }
      }
    }
  }
`
