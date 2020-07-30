import React, { useMemo, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { ORGANIZATION_MEMBERS } from './index.graphql'
import getNodes from '../../utils/getNodes'

const OrganizationMemberSelect = ({ where, organizationId }) => {
  const { data, loading, error } = useQuery(ORGANIZATION_MEMBERS, {
    variables: {
      where: {
        ...where,
        organizations_some: {
          id: organizationId
        }
      }
    }
  })
  const users = useMemo(() => {
    return getNodes(data)
  })
  return {
    organizations: users.nodes
  }
}

export default OrganizationMemberSelect
