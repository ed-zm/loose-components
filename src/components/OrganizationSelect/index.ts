import React, { useMemo, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { ORGANIZATIONS } from './index.graphql'
import getNodes from '../../utils/getNodes'

const OrganizationSelect = () => {
  const { data, loading, error } = useQuery(ORGANIZATIONS)
  const [ organization, setOrganization ] = useState('')
  const organizations = useMemo(() => {
    if(data && data.organizations) return data.organizations
    return []
  })
  return {
    organizations,
    organization,
    setOrganization
  }
}

export default OrganizationSelect
