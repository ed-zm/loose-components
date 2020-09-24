import gql from 'graphql-tag'

export const CREATE_TASK = gql`
  mutation($data: TaskCreateInput!) {
    createOneTask(data: $data) {
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
        username
      }
      assignedTo {
        id
        firstName
        lastName
        avatar
        username
      }
      organization {
        id
      }
      team {
        id
      }
      createdAt
    }
  }
`

export const TEAMS = gql`
  query organizationTeams($organizationId: ID!) {
    teams(where: {
      organization: {
        id: $organizationId
      }
    }) {
      id
      name
    }
  }
`
