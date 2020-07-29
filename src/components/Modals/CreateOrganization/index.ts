import React, { useState, useContext, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { CREATE_ORGANIZATION } from './index.graphql'
import { ORGANIZATIONS } from '../../../screens/Dashboard/Organizations/index.graphql'
import { UserContext } from '../../../contexts/User'

const CreateOrganization = ({ variables }) => {
  const user = useContext(UserContext)
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
        },
        users: [],
        teams: []
      }
    },
    update: (proxy, { data: { createOrganization }}) => {
      const data = proxy.readQuery({ query: ORGANIZATIONS, variables })
      // @ts-ignore
      const newOrganizations = data.organizations.edges.slice()
      newOrganizations.unshift({ node: createOrganization, __typename: "OrganizationEdge" })
      newOrganizations.pop()
      proxy.writeQuery({ query: ORGANIZATIONS, variables, data: { organizations: { ...data.organizations, edges: newOrganizations} }})
    }
  })
  }
  return {
    onCreateOrganization,
    name,
    setName
  }
}

export default CreateOrganization
