import React, { useEffect, useState, useMemo } from 'react'
import moment from 'moment'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { TEAM, DELETE_TEAM } from './index.graphql'
import getNodes from '../../../utils/getNodes'

const Team = ({ id }) => {
  const [tab, setTab] = useState("TASKS");
  const [ member, setMember ] = useState('')
  const { data } = useQuery(TEAM, { variables: { id }})
  const [ deleteTeam, { loading: deletingTeam, error: deleteTeamError }] = useMutation(DELETE_TEAM)

  const onDeleteTeam = async () => {
    deleteTeam({ variables: {
      id
    },
    optimisticResponse: {
      __typename: "Mutation",
      deleteOneTeam: {
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
  return({
    team,
    onDeleteTeam,
    deletingTeam,
    deleteTeamError,
    tab,
    setTab
  })
}

export default Team
