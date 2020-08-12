import gql from 'graphql-tag'

export const TASK = gql`
  query($where: TaskWhereUniqueInput!, $userId: ID!) {
    task(where: $where) {
      id
      title
      description
      state
      code
      estimated
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
          id: $userId
        }) {
          id
        }
      }
      createdAt
    }
  }
`

export const DELETE_TASK = gql`
  mutation deleteTask($id: ID!) {
    deleteTask(
      where: {
      id: $id
    }) {
      id
    }
  }
`
