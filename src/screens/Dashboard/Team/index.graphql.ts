import gql from 'graphql-tag'

export const TEAM = gql`
  query($id: String!) {
    team(where: {
      id: $id
    }) {
      id
      name
      organization {
        id
      }
      users {
        id
        firstName
        lastName
        username
      }
    }
  }
`

export const DELETE_TEAM = gql`
  mutation deleteTeam($id: String!) {
    deleteOneTeam(
      where: {
        id: $id
      }
    ) {
      id
    }
  }
`
