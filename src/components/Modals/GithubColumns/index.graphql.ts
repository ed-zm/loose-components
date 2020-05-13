import gql from 'graphql-tag'

export const IMPORT_GITHUB_CARDS = gql`
  mutation importGithubCards($organizationId: ID!, $projectId: String!, $columnId: String!) {
    importGithubCards(
      organizationId: $organizationId,
      projectId: $projectId,
      columnId: $columnId
    ) {
      id
      title
      state
      description
    }
  }
`

export const GITHUB_COLUMNS = gql`
  query githubColumns($organizationId: ID!, $projectId: ID!) {
    githubColumns(
        organizationId: $organizationId,
        projectId: $projectId
    )
    {
      id
      name
      updatedAt
    }
  }
`
