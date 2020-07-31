import gql from 'graphql-tag'

export const ORGANIZATIONS = gql`
  query(
    $where: OrganizationWhereInput
    $orderBy: OrganizationOrderByInput,
    $first: Int,
    $last: Int,
    $skip: Int,
    $before: String,
    $after: String
  ) {
    organizations(
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
          teams {
            id
          }
          owner {
            id
          }
        }
      }
    }
  }
`
