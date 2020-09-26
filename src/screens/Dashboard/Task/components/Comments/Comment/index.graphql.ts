import gql from 'graphql-tag'

export const UPDATE_COMMENT = gql`
  mutation updateOneComment(
    $text: String!,
    $commentId: String!,
    $mentions: [ResponseRequestCreateWithoutTaskInput!])
  {
    updateOneComment(
      where: { id: $commentId }
      data: {
        text: { set: $text },
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
  mutation deleteOneComment(
    $id: String!
  ) {
    deleteOneComment(
      where: {
        id: $id
      }
    ) {
      id
    }
  }
`
