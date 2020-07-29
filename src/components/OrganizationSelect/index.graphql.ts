import gql from 'graphql-tag'

export const ORGANIZATIONS = gql`
  query {
    organizations {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      # aggregate {
      #  count
      # }
      edges {
        # cursor
        node {
          id
          name
        }
      }
    }
  }
`
