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
        firstName
        lastName
        avatar
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
