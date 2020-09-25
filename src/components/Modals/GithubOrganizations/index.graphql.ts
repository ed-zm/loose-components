import gql from 'graphql-tag'

export const GITHUB_ORGANIZATIONS = gql`
  query($organizationId: ID!) {
    githubOrganizations(organizationId: $organizationId) {
      id
      login
      description
    }
}
`


export const LINK_ORGANIZATION = gql`
  mutation($organizationId: String!, $organization: String!) {
    updateOneOrganization(
      where: {
          id: $organizationId
      },
      data: {
          githubOrganization: { set: $organization }
      }
    ) {
      id
      githubToken
      githubOrganization
    }
  }
`
