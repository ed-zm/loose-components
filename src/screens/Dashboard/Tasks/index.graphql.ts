import gql from 'graphql-tag'

export const TASKS = gql`
  query(
    $state: Int,
    $createdBy: ID,
    $assignedTo: ID,
    $titleFilter: String,
    $orderBy: TaskOrderByInput,
    $first: Int,
    $last: Int,
    $skip: Int,
    $before: String,
    $after: String
  ) {
    tasks(where: {
      state: $state,
      title_contains: $titleFilter,
      OR: [
        {assignedTo: {
          id: $assignedTo
        }},
        {createdBy: {
          id: $createdBy
        }}
      ]
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
