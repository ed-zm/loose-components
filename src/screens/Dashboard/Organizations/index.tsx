import React, { useState, useContext, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { ORGANIZATIONS, CREATE_ORGANIZATION } from './index.graphql'
import { UserContext } from '../../../contexts/User'
import getNodes from '../../../utils/getNodes'

const Organizations = () => {
  const user = useContext(UserContext)
  const [ quantity, setQuantity ] = useState(2)
  const [ nameFilter, setNameFilter ] = useState('')
  const [ cursor, setCursor ] = useState({after: null, before: null})
  const { data, loading, error } = useQuery(ORGANIZATIONS, {
    variables: {
      nameFilter,
      ...cursor,
      first: quantity,
      // last: quantity
    }
  })
  const [ createOrganization ] = useMutation(CREATE_ORGANIZATION)
  const [ name, setName ] = useState('')
  const onCreateOrganization = async () => {
    createOrganization({ variables: {
      name,
      userId: user.id
    },
    optimisticResponse: {
      __typename: 'Mutation',
      createOrganization: {
        __typename: "Organization",
        id: "-1",
        name,
        owner: {
          id: user.id,
          __typename: "User"
        }
      }
    },
    update: (proxy, { data: { createOrganization }}) => {
      const data = proxy.readQuery({ query: ORGANIZATIONS })
      // @ts-ignore
      const newOrganizations = data.organizations.slice()
      newOrganizations.push(createOrganization)
      proxy.writeQuery({ query: ORGANIZATIONS, data: { organizations: newOrganizations }})
    }
  })
  }
  const onSetCursor = async (action) => {
    if(action === 'BEFORE' && pageInfo.hasPreviousPage) {
      setCursor({ before: pageInfo.startCursor, after: null})
    }
    if(action === 'AFTER' && pageInfo.hasNextPage) {
      setCursor({ before: null, after: pageInfo.endCursor })
    }
  }
  const organizations = useMemo(() => {
    return getNodes(data)
  }, [data])
  const pageInfo = useMemo(() => {
    return organizations.pageInfo
  }, [organizations])
  return {
    onCreateOrganization,
    name,
    setName,
    organizations: organizations.nodes,
    nameFilter,
    setNameFilter,
    onSetCursor,
    loading,
    pageInfo
  }
}

export default Organizations
