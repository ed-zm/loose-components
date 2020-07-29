import gql from 'graphql-tag'

export const COMMENTS = gql`
  query comments(
    $taskId: ID!,
    $orderBy: CommentOrderByInput,
    $first: Int,
    $last: Int,
    $skip: Int,
    $before: String,
    $after: String
  ) {
    comments(
      where: {
        task: {
          id: $taskId
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
          text
          createdAt
          updatedAt
          task {
            id
          }
          user {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
`

export const CREATE_COMMENT = gql`
  mutation createComment($text: String!, $taskId: ID!, $userId: ID!, $mentions: [ResponseRequestCreateWithoutTaskInput!]) {
    updateTask(
      where: { id: $taskId }
      data: {
        comments: {
          create: [{
            text: $text,
            user: {
              connect: {
                id: $userId
              }
            }
          }]
        },
        responseRequests: {
          create: $mentions
        }
    }) {
      id
      comments {
        id
        text
        createdAt
        updatedAt
        task {
          id
        }
        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`
