import gql from 'graphql-tag'

export const UPDATE_ORGANIZATION = gql`
  mutation($name: String!, $organizationId: ID!) {
    updateOrganization(
      where: {
        id: $organizationId
      },
      data: {
        name: $name
      }) {
      id
      name
    }
  }
`
