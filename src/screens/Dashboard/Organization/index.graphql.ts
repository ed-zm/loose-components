import gql from 'graphql-tag'

export const ORGANIZATION = gql`
  query($id: ID!) {
    organization(where: { id: $id }) {
      id
      name
      githubToken
      owner {
        id
      }
    }
  }
`
