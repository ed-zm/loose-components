import gql from 'graphql-tag'

export const TASKS = gql`
  query($state: Int) {
    tasks(where: {
      state: $state
    }) {
      id
      title
      description
      estimated
      state
      code
      createdBy {
        id
        firstName
        lastName
        avatar
      }
      organization {
        id
      }
      createdAt
    }
  }
`
