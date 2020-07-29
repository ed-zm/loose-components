import gql from 'graphql-tag'

export const TASKS = gql`
  query(
    $where: TaskWhereInput,
    $orderBy: TaskOrderByInput,
    $first: Int,
    $last: Int,
    $skip: Int,
    $before: String,
    $after: String
  ) {
    tasks(where: $where,
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
          team {
            id
          }
          createdAt
        }
      }
    }
  }
`
