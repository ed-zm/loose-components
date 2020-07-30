import React, { useEffect, useState, useMemo } from 'react'
import moment from 'moment'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { ORGANIZATION_MEMBERS, ADD_MEMBER, REMOVE_MEMBER } from './index.graphql'
import getNodes from '../../../utils/getNodes'

const ManageTeamMembers = ({ team }) => {
  const [ member, setMember ] = useState('')
  const [ tab, setTab ] = useState('ADD')
  // const {
  //   data: organizationMembersData,
  //   loading: loadingOrganizationMembers,
  //   error: organizationMembersError
  // } = useQuery(ORGANIZATION_MEMBERS, {
  //   variables: {
  //     organizationId: team.organization.id,
  //     teamId: team.id
  //   }
  // })
  const [ addMember, { loading: addingMember }] = useMutation(ADD_MEMBER)
  const [ removeMember, { loading: removingMember }] = useMutation(REMOVE_MEMBER)
  const onRemoveMember = async (memberId) => {
    await removeMember({ variables: {
      teamId: team.id,
      memberId
    }})
    // await refetchOrganizationMembers({
    //   fetchPolicy: 'cache-and-network'
    // })
  }
  const onAddMember = async (id) => {
    await addMember({
      variables: {
        teamId: team.id,
        memberId: id
      }
    })
    await setMember('')
    // await refetchOrganizationMembers({
    //   fetchPolicy: 'cache-and-network'
    // })
  }
  return({
    removingMember,
    onRemoveMember,
    onAddMember,
    addingMember,
    member,
    setMember,
    tab,
    setTab
  })
}

export default ManageTeamMembers
