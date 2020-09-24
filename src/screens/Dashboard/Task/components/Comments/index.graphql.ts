import gql from 'graphql-tag'

export const COMMENTS = gql`
  query comments(
    $taskId: String!,
    $orderBy: [CommentOrderByInput!],
    $first: Int,
    $last: Int,
    $before: CommentWhereUniqueInput,
    $after: CommentWhereUniqueInput
  ) {
    comments(
      where: {
        task: {
          id: { equals: $taskId }
        }
      },
      first: $first,
      last: $last,
      before: $before,
      after: $after,
      orderBy: $orderBy
    ) {
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
`

export const CREATE_COMMENT = gql`
  mutation createComment($text: String!, $taskId: String!, $userId: String!, $mentions: [ResponseRequestCreateWithoutTaskInput!]) {
    updateOneTask(
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
