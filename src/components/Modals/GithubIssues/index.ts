import React, { useContext } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { IMPORT_GITHUB_ISSUES, GITHUB_ISSUES } from './index.graphql'
import { ModalContext } from '../../../contexts/UI/Modal'

const GithubIssues = ( { organization, repository }) => {
  const modal = useContext(ModalContext)
  const [importGithubIssues] = useMutation(IMPORT_GITHUB_ISSUES)
  const { data, loading: loadingIssues, error: issuesError } = useQuery(GITHUB_ISSUES, {
    variables: {
      repository: repository.fullName,
      organizationId: organization.id
    }
  })
  const onImportGithubIssues = async (open = true) => {
    await importGithubIssues({
      variables: {
        organizationId: organization.id,
        repository: repository.fullName,
        open
      }
    })
    await modal.actions.closeModal()
  }
  const issues = (data && data.githubIssues) ? data.githubIssues : []
  const open = issues.filter(issue => !issue.closedAt)
  const closed = issues.filter(issue => !!issue.closedAt)
  return {
    issues,
    onImportGithubIssues,
    open,
    closed,
    loadingIssues,
    issuesError
  }
}

export default GithubIssues
