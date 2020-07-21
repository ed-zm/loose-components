import gql from 'graphql-tag'

export const UPDATE_COMMENT = gql`
  mutation updateComment(
    $text: String!,
    $commentId: ID!,
    $mentions: [ResponseRequestCreateWithoutTaskInput!])
  {
    updateComment(
      where: { id: $commentId }
      data: {
        text: $text,
        task: {
          update: {
            responseRequests: {
              create: $mentions
            }
          }
        }
    }) {
      id
      text
      createdAt
      task {
        id
      }
    }
  }
`

export const DELETE_COMMENT = gql`
  mutation deleteComment(
    $id: ID!
  ) {
    deleteComment(
      where: {
        id: $id
      }
    ) {
      id
    }
  }
`
