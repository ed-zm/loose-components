import gql from 'graphql-tag'

export const TEAMS = gql`
  query {
    teams {
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
