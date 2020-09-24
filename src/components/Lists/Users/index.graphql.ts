import gql from 'graphql-tag'

export const USERS = gql`
  query(
    $where: UserWhereInput,
    $orderBy: [UserOrderByInput!],
    $first: Int,
    $last: Int,
    $before: UserWhereUniqueInput,
    $after: UserWhereUniqueInput
  ) {
    users(
      where: $where,
      first: $first,
      last: $last,
      before: $before,
      after: $after,
      orderBy: $orderBy
    ) {
      id
      firstName
      lastName
    }
  }
`
