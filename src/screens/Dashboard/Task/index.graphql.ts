import gql from 'graphql-tag'

export const TASK = gql`
  query($where: TaskWhereUniqueInput!, $userId: ID!) {
    task(where: $where) {
      id
      title
      description
      state
      code
      assignedTo {
        id
        firstName
        lastName
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
