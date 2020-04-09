import gql from 'graphql-tag'

export const USER = gql`
  query($id: ID!) {
    user(where: { id: $id }) {
      id
      avatar
      username
      firstName
      lastName
      email
    }
  }
`

export const GET_S3_SIGNED_URL = gql`
  query getS3SignedUrl($id: ID!, $fileType: String!, $operation: String!) {
    getS3SignedUrl (
      fileType: $fileType,
      operation: $operation,
      id: $id
    )
  }
`

export const CHANGE_PICTURE = gql`
  mutation changePicture($id: ID!, $avatar: String!) {
    updateUser(where: { id: $id }, data: { avatar: $avatar }) {
      id
      avatar
    }
  }
`