import gql from 'graphql-tag'

export const ORGANIZATION = gql`
  query($id: ID!) {
    organization(where: { id: $id }) {
      id
      name
      githubOrganization
      githubToken
      owner {
        id
      }
    }
  }
`

export const GITHUB_LOGIN = gql`
  mutation($code: String!, $organizationId: ID!) {
    githubLogin(code: $code, organizationId: $organizationId)
  }
`

export const GITHUB_REPOS = gql`
  query($organizationId: ID!) {
    githubRepositories(organizationId: $organizationId) {
      id
      name
      fullName
      private
      updatedAt
      language
      openIssuesCount
      description
      stargazersCount
      forksCount
    }
  }
`

export const GITHUB_PROJECTS = gql`
  query($organizationId: ID!) {
    githubProjects(organizationId: $organizationId) {
      id
      name
      body
      updatedAt
    }
  }
`

export const UNLINK_ORGANIZATION = gql`
  mutation($organizationId: ID!) {
    updateOrganization(
      where: {
          id: $organizationId
      },
      data: {
          githubOrganization: "",
          githubToken: ""
      }
    ) {
      id
      githubOrganization
      githubToken
    }
  }
`
