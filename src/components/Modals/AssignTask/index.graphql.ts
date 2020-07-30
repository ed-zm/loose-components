import gql from 'graphql-tag'

export const ASSIGN_TASK = gql`
  mutation assignTask($id: ID!, $userId: ID!) {
    updateTask(
      where: { id: $id },
      data: {
        assignedTo: {
          connect: {
            id: $userId
          }
        }
      }
    ) {
      id
      state
      assignedTo {
        id
        firstName
        lastName
      }
    }
  }
`

export const UNASSIGN_TASK = gql`
  mutation assignTask($id: ID!, $userId: ID!) {
    updateTask(
      where: { id: $id },
      data: {
        assignedTo: {
          disconnect: {
            id: $userId
          }
        }
      }
    ) {
      id
      state
      assignedTo {
        id
        firstName
        lastName
      }
    }
  }
`
