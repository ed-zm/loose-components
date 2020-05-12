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
  mutation($organizationId: ID!, $organization: String!) {
    updateOrganization(
      where: {
          id: $organizationId
      },
      data: {
          githubOrganization: $organization
      }
    ) {
      id
      githubToken
      githubOrganization
    }
  }
`
