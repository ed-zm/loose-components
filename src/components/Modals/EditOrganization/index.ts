import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { UPDATE_ORGANIZATION } from './index.graphql'

const UpdateOrganization = ({ organization }) => {
  const [ updateOrganization, { loading, error } ] = useMutation(UPDATE_ORGANIZATION)
  const [ name, setName ] = useState(organization.name)
  const onUpdateOrganization = async () => {
    updateOrganization({ variables: {
      organizationId: organization.id,
      name
    },
    optimisticResponse: {
      __typename: 'Mutation',
      updateOneOrganization: {
        __typename: "Organization",
        id: organization.id,
        name
      }
    }
  })
  }
  return {
    onUpdateOrganization,
    loading,
    error,
    name,
    setName
  }
}

export default UpdateOrganization
