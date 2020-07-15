import gql from 'graphql-tag'

export const UPDATE_TEAM = gql`
  mutation updateTeam($id: ID!, $name: String) {
    updateTeam(
      where: {
        id: $id
      },
      data: {
        name: $name
      }
    ) {
      id
      name
    }
  }
`
