import React, { useContext } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { IMPORT_GITHUB_CARDS, GITHUB_COLUMNS } from './index.graphql'
import { ModalContext } from '../../../contexts/UI/Modal'

const GithubColumns = ({ organization, project }) => {
  const modal = useContext(ModalContext)
  const [importGithubCards] = useMutation(IMPORT_GITHUB_CARDS)
  const { data, loading, error } = useQuery(GITHUB_COLUMNS, {
    variables: {
      organizationId: organization.id,
      projectId: project.id
    }
  })
  const onImportGithubCards = async (columnId) => {
    await importGithubCards({
      variables: {
        organizationId: organization.id,
        columnId,
        projectId: project.id
      }
    })
    await modal.actions.closeModal()
  }
  return {
    columns: (data && data.githubColumns) ? data.githubColumns : [],
    loadingColumns: loading,
    columnsError: error,
    onImportGithubCards
  }
}

export default GithubColumns
