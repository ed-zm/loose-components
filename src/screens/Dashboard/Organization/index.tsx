import React, { useState, useEffect, useMemo, useContext } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { ModalContext } from '../../../contexts/UI/Modal'
import { UserContext } from '../../../contexts/User'
import {
  ORGANIZATION,
  DELETE_ORGANIZATION,
  GITHUB_LOGIN,
  GITHUB_REPOS,
  GITHUB_PROJECTS,
  UNLINK_ORGANIZATION,
  INVITE_TO_ORGANIZATION
} from './index.graphql'

const Organization = ({ id }) => {
  const { actions } = useContext(ModalContext);
  const user = useContext(UserContext)
  const [ token, setToken ] = useState('')
  const [ tab, setTab ] = useState('REPOSITORIES')
  const { data, loading, error } = useQuery(ORGANIZATION, { variables: { id, userId: user.id } })
  const [ deleteOrganization, { loading: deletingOrganization, error: deleteOrganizationError } ] = useMutation(DELETE_ORGANIZATION)
  const [ githubLogin, { data: github }] = useMutation(GITHUB_LOGIN)
  const [ inviteToOrganization, { error: err, loading: invitingToOrganization } ] = useMutation(INVITE_TO_ORGANIZATION)
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
  const onDeleteOrganization = async () => {
    await deleteOrganization({
      variables: {
        id: organization.id
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteOrganization: {
          __typename: "Organization",
          id: organization.id
        }
      }
    })
  }
  const onInviteToOrganization = async ({ id, email }) => {
    if(id) {
      await inviteToOrganization({
        variables: {
          userId: user.id,
          to: id,
          typeId: organization.id
        },
        // optimisticResponse: {
        //   __typename: 'Mutation',
        //   inviteToOrganization: {
        //     __typename: "Invite",
        //     id: -1,
        //     to: {
        //       __typename: "User",
        //       id
        //     },
        //     from: {
        //       __typename: "User",
        //       id: user.id
        //     }
        //   }
        // },
        // update: (proxy, { data: { inviteToOrganization } })
      })
    }
    if(email) {
      await inviteToOrganization({
        variables: {
          userId: user.id,
          email,
          typeId: organization.id
        }
      })
    }
  }
  const projects = useMemo(() => {
    if(projectsData && projectsData.githubProjects) return projectsData.githubProjects
    return []
  }, [projectsData])
  const repositories = useMemo(() => {
    if(repositoriesData && repositoriesData.githubRepositories) return repositoriesData.githubRepositories
    return []
  }, [repositoriesData])
  return {
    organization,
    loading,
    error,
    onDeleteOrganization,
    deletingOrganization,
    deleteOrganizationError,
    projects,
    loadingProjects,
    projectsError,
    repositories,
    loadingRepositories,
    repositoriesError,
    onError,
    onSuccess,
    tab,
    setTab,
    onUnlinkOrganization,
    onInviteToOrganization,
    invitingToOrganization
  }
}

export default Organization
