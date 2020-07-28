import gql from 'graphql-tag'

export const ORGANIZATIONS = gql`
  query(
    $nameFilter: String,
    $orderBy: OrganizationOrderByInput,
    $first: Int,
    $last: Int,
    $skip: Int,
    $before: String,
    $after: String
  ) {
    organizations(
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

export const CREATE_ORGANIZATION = gql`
  mutation($name: String!, $userId: ID!) {
    createOrganization(data: {
      name: $name,
      owner: {
        connect: {
          id: $userId
        }
      }
    }) {
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
`
