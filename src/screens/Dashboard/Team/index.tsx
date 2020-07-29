import React, { useEffect, useState, useMemo } from 'react'
import moment from 'moment'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { TEAM, ORGANIZATION_MEMBERS, DELETE_TEAM, UPDATE_TEAM, ADD_MEMBER, REMOVE_MEMBER, TEAM_TASKS, TEAM_MEMBERS } from './index.graphql'
import getNodes from '../../../utils/getNodes'

const Team = ({ id }) => {
  const [tab, setTab] = useState("TASKS");
  const [ member, setMember ] = useState('')
  const { data } = useQuery(TEAM, { variables: { id }})
  const [ addMember, { loading: addingMember }] = useMutation(ADD_MEMBER)
  const [ removeMember, { loading: removingMember }] = useMutation(REMOVE_MEMBER)
  const [ deleteTeam, { loading: deletingTeam, error: deleteTeamError }] = useMutation(DELETE_TEAM)
  const [ organizationMembersQuery, { data: members, refetch: refetchOrganizationMembers }] = useLazyQuery(ORGANIZATION_MEMBERS)
  const [ teamTasksQuery, { data: teamTasksData, refetch: refetchTeamTasks }] = useLazyQuery(TEAM_TASKS)
  const [ teamMembersQuery, { data: teamMembersData, refetch: refetchTeamMembers }] = useLazyQuery(TEAM_MEMBERS)
  const onRemoveMember = async (memberId) => {
    await removeMember({ variables: {
      teamId: data.team.id,
      memberId
    }})
    await refetchOrganizationMembers({
      fetchPolicy: 'cache-and-network'
    })
  }
  const onAddMember = async () => {
    await addMember({
      variables: {
        teamId: data.team.id,
        memberId: member
      }
    })
    await setMember('')
    await refetchOrganizationMembers({
      fetchPolicy: 'cache-and-network'
    })
  }
  const onDeleteTeam = async () => {
    deleteTeam({ variables: {
      id
    },
    optimisticResponse: {
      __typename: "Mutation",
      deleteTeam: {
        __typename: "Team",
        id
      }
    }
  })
  }
  const team = useMemo(() => {
    if(data && data.team) return data.team
    return null
  }, [data])
  const teamMembers = useMemo(() => {
    return getNodes(teamMembersData)
  }, [teamMembersData])
  const teamTasks = useMemo(() => {
    return getNodes(teamTasksData)
  }, [teamTasksData])
  useEffect(() => {
    if(team) {
      organizationMembersQuery({ variables: {
        teamId: data.team.id,
        organizationId: data.team.organization.id
      }})
    }
  }, [team])
  useEffect(() => {
    if(members && !!members.users.length) setMember(members.users[0].id)
  }, [members])
  useEffect(() => {
    if(team) {
      if(tab === 'TASKS') {
        teamTasksQuery({ variables : {
          teamId: team.id
        }})
      }
      if(tab === 'USERS') {
        teamMembersQuery({ variables : {
          teamId: team.id
        }})
      }
    }
  }, [tab, team])
  const teamMembersPageInfo = useMemo(() => {
    return teamMembers.pageInfo
  }, [teamMembers])
  const teamTasksPageInfo = useMemo(() => {
    return teamTasks.pageInfo
  }, [teamTasks])
  return({
    team,
    teamMembers: teamMembers.nodes,
    teamMembersPageInfo,
    teamTasks: teamTasks.nodes,
    teamMembersPageInfo,
    onDeleteTeam,
    deletingTeam,
    deleteTeamError,
    removingMember,
    onRemoveMember,
    onAddMember,
    member,
    setMember,
    addingMember,
    tab,
    setTab
  })
}

export default Team
