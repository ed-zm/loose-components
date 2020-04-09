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
      }
      organization {
        id
      }
      createdAt
    }
  }
`

export const CREATE_TASK = gql`
  mutation($data: TaskCreateInput!) {
    createTask(data: $data) {
      id
      title
      description
      estimated
      state
      code
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

export const ORGANIZATIONS = gql`
  query {
    organizations {
      id
      name
    }
  }
`