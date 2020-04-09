import gql from 'graphql-tag'

export const LABELS = gql`
  query labels($taskId: ID!, $organizationId: ID) {
    labels(where: {
      organization: {
        id: $organizationId
      }
      tasks_some: {
        id: $taskId
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
  mutation addLabel($text: String!, $taskId: ID!, $organizationId: ID!) {
    createLabel(data: {
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