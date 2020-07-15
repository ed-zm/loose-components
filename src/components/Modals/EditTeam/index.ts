import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { UPDATE_TEAM } from './index.graphql'

const UpdateTeam = ({ team }) => {
  const [ updateTeam, { loading, error } ] = useMutation(UPDATE_TEAM)
  const [ name, setName ] = useState(team.name)
  const onUpdateTeam = async () => {
    updateTeam({ variables: {
      id: team.id,
      name
    },
    optimisticResponse: {
      __typename: 'Mutation',
      updateTeam: {
        __typename: "Team",
        id: team.id,
        name
      }
    }
  })
  }
  return {
    onUpdateTeam,
    loading,
    error,
    name,
    setName
  }
}

export default UpdateTeam
