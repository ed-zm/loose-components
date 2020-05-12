import React, { useEffect, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { GITHUB_ORGANIZATIONS, LINK_ORGANIZATION } from './index.graphql'
import { ModalContext } from '../../../contexts/UI/Modal'

const GithubOrganizations = ({ organization }) => {
  const modal = useContext(ModalContext)
  const { data } = useQuery(GITHUB_ORGANIZATIONS, {
      variables: { organizationId: organization.id}
  })
  const [
    linkOrganization,
    {
      data: linkOrganizationData,
      loading: linkingOrganization,
      error: linkOrganizationError
    }
  ] = useMutation(LINK_ORGANIZATION)
  const onLinkOrganization = async org => {
    await linkOrganization({
      variables: {
        organizationId: organization.id,
        organization: org.login
      }
    })
  }
  useEffect(() => {
    if(linkOrganizationData && linkOrganizationData.updateOrganization) {
      modal.actions.closeModal()
    }
  }, [linkOrganizationData])
  return {
    githubOrganizations: (data && data.githubOrganizations) ? data.githubOrganizations : [],
    linkingOrganization,
    linkOrganizationError,
    onLinkOrganization
  }
}

export default GithubOrganizations
