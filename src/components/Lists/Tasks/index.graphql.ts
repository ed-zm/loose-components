import gql from 'graphql-tag'

export const TASKS = gql`
  query(
    $where: TaskWhereInput,
    $orderBy: [TaskOrderByInput!],
    $first: Int,
    $last: Int,
    $before: TaskWhereUniqueInput,
    $after: TaskWhereUniqueInput
  ) {
    tasks(where: $where,
    first: $first,
    last: $last,
    before: $before,
    after: $after,
    orderBy: $orderBy
    ) {
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
        username
        avatar
      }
      assignedTo {
        id
        firstName
        lastName
        username
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
`

export const RESPONSE_REQUESTS = gql`
  query(
    #$where: ResponseRequestWhereInput,
    $orderBy: [ResponseRequestOrderByInput!],
    $first: Int,
    $last: Int,
    $before: ResponseRequestWhereUniqueInput,
    $after: ResponseRequestWhereUniqueInput
  ) {
    responseRequests(
      #where: $where,
      first: $first,
      last: $last,
      before: $before,
      after: $after,
      orderBy: $orderBy
    ) {
      id
      title
      description
      task {
        id
        code
      }
      state
      createdBy {
        id
        firstName
        lastName
        username
        avatar
      }
      assignedTo {
        id
        firstName
        lastName
        username
        avatar
      }
      createdAt
    }
  }
`
