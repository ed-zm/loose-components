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
    }
  }
`

export const RESPONSE_REQUESTS = gql`
  query(
    #$where: ResponseRequestWhereInput,
    $orderBy: ResponseRequestOrderByInput,
    $first: Int,
    $last: Int,
    $skip: Int,
    $before: String,
    $after: String
  ) {
    responseRequests(
      #where: $where,
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
    }
  }
`
