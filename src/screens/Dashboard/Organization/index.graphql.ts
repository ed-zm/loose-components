import gql from 'graphql-tag'

export const ORGANIZATION = gql`
  query($id: String!) {
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

export const DELETE_ORGANIZATION = gql`
  mutation deleteOneOrganization($id: String!) {
    deleteOneOrganization(
      where: {
      id: $id
    }) {
      id
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
  mutation($organizationId: String!) {
    updateOneOrganization(
      where: {
          id: $organizationId
      },
      data: {
          githubOrganization: { set: "" },
          githubToken: { set: "" }
      }
    ) {
      id
      githubOrganization
      githubToken
    }
  }
`

export const INVITE_TO_ORGANIZATION = gql`
  mutation inviteToOrganization($to: String, $email: String, $userId: String!, $typeId: String!) {
    inviteToOrganization(data: {
      type: ORGANIZATION,
      typeId: $typeId,
      email: $email,
      code: "1",
      to: {
        connect: {
          id: $to
        }
      },
      from: {
        connect: {
          id: $userId
        }
      }
    }) {
      id
      to {
        id
      }
      from {
        id
      }
    }
  }
`
