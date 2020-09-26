import gql from 'graphql-tag'

export const LABELS = gql`
  query labels($taskId: String!, $organizationId: String) {
    labels(where: {
      organization: {
        id: { equals: $organizationId }
      }
      tasks: {
        some: { id: { equals: $taskId } }
      }
    }) {
      id
      color
      text
      organization {
        id
      }
    }
  }
`

export const ADD_LABEL = gql`
  mutation addLabel($text: String!, $taskId: String!, $organizationId: String!) {
    createOneLabel(data: {
      text: $text,
      color: "green",
      organization: {
        connect: { id: $organizationId }
      }
      tasks: {
        connect: [ { id: $taskId } ]
      }
    }) {
      id
      color
      text
      organization {
        id
      }
    }
  }
`

export const REMOVE_LABEL = gql`
  mutation removeLabel($id: String!, $taskId: String!) {
    updateOneLabel(
      where: {
        id: $id
      },
      data: {
        tasks: {
          disconnect: [{ id: $taskId }]
        }
      }
    ) {
      id
    }
  }
`
