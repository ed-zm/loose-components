import gql from 'graphql-tag'

export const TASK = gql`
  query($where: TaskWhereUniqueInput!) {
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
      }
      organization {
        id
      }
      createdAt
    }
  }
`


