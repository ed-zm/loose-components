import gql from 'graphql-tag'

export const ORGANIZATIONS = gql`
  query {
    organizations {
      id
      name
    }
  }
`
