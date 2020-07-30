import gql from 'graphql-tag'

export const ORGANIZATION_MEMBERS = gql`
  query organizationMembers(
    $where: UserWhereInput,
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
