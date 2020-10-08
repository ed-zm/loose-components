import gql from 'graphql-tag'

export const TASK = gql`
  query($where: TaskWhereUniqueInput!, $userId: String!) {
    task(where: $where) {
      id
      title
      description
      state
      code
      estimated
      priority
      assignedTo {
        id
        firstName
        lastName
        username
        avatar
      }
      labels {
        id
        text
        color
      }
      createdBy {
        id
        firstName
        lastName
        username
        avatar
      }
      organization {
        id
        users(where: {
          id: { equals: $userId }
        }) {
          id
        }
      }
      createdAt
    }
  }
`

export const DELETE_TASK = gql`
  mutation deleteOneTask($id: String!) {
    deleteOneTask(
      where: {
      id: $id
    }) {
      id
    }
  }
`
