import React, { useMemo, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { TEAMS } from './index.graphql'
import getNodes from '../../utils/getNodes'

const TeamSelect = () => {
  const { data, loading, error } = useQuery(TEAMS)
  const [ team, setTeam ] = useState('')
  const teams = useMemo(() => {
    return getNodes(data)
  })
  return {
    teams: teams.nodes,
    team,
    setTeam
  }
}

export default TeamSelect
