import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { TEAM, ORGANIZATION_MEMBERS, ADD_MEMBER, REMOVE_MEMBER } from './index.graphql'

const Team = ({ id }) => {
  const [ member, setMember ] = useState('')
  const { data } = useQuery(TEAM, { variables: { id }})
  const [ addMember, { loading: addingMember }] = useMutation(ADD_MEMBER)
  const [ removeMember, { loading: removingMember }] = useMutation(REMOVE_MEMBER)
  const [ organizationMembersQuery, { data: members, refetch: refetchOrganizationMembers }] = useLazyQuery(ORGANIZATION_MEMBERS)
  const onRemoveMember = async () => {
    await removeMember({ variables: {
      teamId: data.team.id,
      memberId: member.id
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
  useEffect(() => {
    if(data && data.team) {
      organizationMembersQuery({ variables: {
        teamId: data.team.id,
        organizationId: data.team.organization.id
      }})
    }
  }, [data])
  useEffect(() => {
    if(members && !!members.users.length) setMember(members.users[0].id)
  }, [members])
  return({
    data,
    removingMember,
    onRemoveMember,
    onAddMember,
    member,
    setMember,
    addingMember,
    members
  })
}

export default Team
