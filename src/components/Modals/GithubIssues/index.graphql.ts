import gql from 'graphql-tag'

export const IMPORT_GITHUB_ISSUES = gql`
  mutation importGithubIssues($organizationId: ID!, $repository: String!, $open: Boolean) {
    importGithubIssues(organizationId: $organizationId, repository: $repository, open: $open) {
      id
      title
      state
      description
    }
  }
`

export const GITHUB_ISSUES = gql`
  query($organizationId: ID!, $repository: String!) {
    githubIssues(organizationId: $organizationId, repository: $repository) {
      id
      title
      state
      number
      updatedAt
      createdAt
      closedAt
      url
      body
      comments
    }
  }
`
