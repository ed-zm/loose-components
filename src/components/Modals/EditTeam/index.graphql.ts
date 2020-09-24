import gql from 'graphql-tag'

export const UPDATE_TEAM = gql`
  mutation updateOneTeam($id: String!, $name: String) {
    updateOneTeam(
      where: {
        id: $id
      },
      data: {
        name: { set: $name }
      }
    ) {
      id
      name
    }
  }
`
