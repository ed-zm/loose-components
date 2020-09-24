import gql from 'graphql-tag'

export const ORGANIZATIONS = gql`
  query(
    $where: OrganizationWhereInput
    $orderBy: [OrganizationOrderByInput!],
    $first: Int,
    $last: Int,
    $before: OrganizationWhereUniqueInput,
    $after: OrganizationWhereUniqueInput
  ) {
    organizations(
      where: $where,
      first: $first,
      last: $last,
      before: $before,
      after: $after,
      orderBy: $orderBy
    ) {
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
