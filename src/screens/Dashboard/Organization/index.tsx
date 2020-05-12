import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { ModalContext } from '../../../contexts/UI/Modal'
import { ORGANIZATION, GITHUB_LOGIN, GITHUB_REPOS, GITHUB_PROJECTS, UNLINK_ORGANIZATION } from './index.graphql'

const Organization = ({ id }) => {
  const { actions } = useContext(ModalContext);
  const [ token, setToken ] = useState('')
  const [ tab, setTab ] = useState('REPOSITORIES')
  const { data, loading, error } = useQuery(ORGANIZATION, { variables: { id } })
  const [ githubLogin, { data: github }] = useMutation(GITHUB_LOGIN)
  const [ unlinkOrganization ] = useMutation(UNLINK_ORGANIZATION)
  const [
    fetchRepositories,
    {
      data: repositoriesData,
      loading: loadingRepositories,
      error: repositoriesError
    }
  ] = useLazyQuery(GITHUB_REPOS, {
    fetchPolicy: 'network-only'
  })
  const [
    fetchProjects,
    {
      data: projectsData,
      loading: loadingProjects,
      error: projectsError
    }
  ] = useLazyQuery(GITHUB_PROJECTS, {
    fetchPolicy: 'network-only'
  })
  const organization = (data && data.organization) ? data.organization : null
  const onSuccess = async ({ code }) => {
    if(code) {
      await githubLogin({ variables: { code, organizationId: organization.id }})
    }
  }

  const onUnlinkOrganization = async () => {
    await setToken('')
    await unlinkOrganization({
      variables: { organizationId: organization.id },
      update: (proxy) => {
        proxy.writeQuery({
          query: GITHUB_REPOS,
          variables: { organizationId: organization.id },
          data: { githubRepositories: [] }
        })
        proxy.writeQuery({
          query: GITHUB_PROJECTS,
          variables: { organizationId: organization.id },
          data: { githubProjects: [] }
        })
      }
    })
  }

  const onError = async () => {}
  useEffect(() => {
    if(github && github.githubLogin) {
      setToken(github.githubLogin)
    }
  }, [github])

  useEffect(() => {
    const fetchData = async () => {
      if(tab === 'REPOSITORIES') {
        await fetchRepositories({ variables: {
          organizationId: organization.id
        }})
      } else if(tab === 'PROJECTS'){
        await fetchProjects({ variables: {
          organizationId: organization.id
        }})
      }
    }
    if(organization) {
      if(!organization.githubOrganization && (organization.githubToken || token)) {
        actions.openModal({ modal: 'GithubOrganizations', title: '', params: { organization } })
      } else {
        fetchData()
      }
    }
  }, [token, organization, tab])
  return {
    organization,
    loading,
    error,
    projects: (projectsData && projectsData.githubProjects) ? projectsData.githubProjects : [],
    loadingProjects,
    projectsError,
    repositories: (repositoriesData && repositoriesData.githubRepositories) ? repositoriesData.githubRepositories : [],
    loadingRepositories,
    repositoriesError,
    onError,
    onSuccess,
    tab,
    setTab,
    onUnlinkOrganization
  }
}

export default Organization
