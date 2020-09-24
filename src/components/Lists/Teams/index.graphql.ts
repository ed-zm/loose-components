import gql from 'graphql-tag'

export const TEAMS = gql`
  query(
    $where: TeamWhereInput,
    $orderBy: [TeamOrderByInput!],
    $first: Int,
    $last: Int,
    $before: TeamWhereUniqueInput,
    $after: TeamWhereUniqueInput
  ) {
    teams(
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
    }
  }
`
