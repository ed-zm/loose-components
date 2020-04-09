import gql from 'graphql-tag'

export const COMMENTS = gql`
  query comments($taskId: ID!) {
    comments(where: {
      task: {
        id: $taskId
      }
    }) {
      id
      text
      createdAt
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