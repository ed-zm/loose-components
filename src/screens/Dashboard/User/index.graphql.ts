import gql from 'graphql-tag'

export const USER = gql`
  query($id: String!) {
    user(where: { id: $id }) {
      id
      biography
      avatar
      username
      firstName
      lastName
      email
    }
  }
`

export const GET_S3_SIGNED_URL = gql`
  query getS3SignedUrl($id: ID!, $fileType: String!, $operation: String!, $folder: String) {
    getS3SignedUrl (
      fileType: $fileType,
      operation: $operation,
      id: $id,
      folder: $folder
    )
  }
`

export const CHANGE_PICTURE = gql`
  mutation changePicture($id: String!, $avatar: String!) {
    updateOneUser(where: { id: $id }, data: { avatar: { set: $avatar } }) {
      id
      avatar
    }
  }
`

export const UPDATE_PROFILE = gql`
  mutation($id: String!, $bio: String) {
    updateOneUser(
      where: {
        id: $id
      },
      data: {
        biography: { set: $bio }
      }
    ) {
      id
      biography
    }
  }
`
