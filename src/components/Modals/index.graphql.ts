import gql from 'graphql-tag'

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
