import gql from 'graphql-tag'

export const UPDATE_ORGANIZATION = gql`
  mutation($name: String!, $organizationId: String!) {
    updateOrganization(
      where: {
        id: $organizationId
      },
      data: {
        name: { set: $name }
      }) {
      id
      name
    }
  }
`
