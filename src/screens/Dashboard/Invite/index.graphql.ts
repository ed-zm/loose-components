import gql from 'graphql-tag'

export const INVITE = gql`
  query invite($code: String!) {
    invite(where: {
      code: $code
    }) 
  }
`
