import React, { useState, useEffect, useContext, useMemo } from 'react'
import Link from 'next/link'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { TEAMS, CREATE_TEAM, ORGANIZATIONS } from './index.graphql'
import { UserContext } from '../../../contexts/User'
import getNodes from '../../../utils/getNodes'

const Teams = () => {
  const user = useContext(UserContext)
  const [ quantity, setQuantity ] = useState(2)
  const [ cursor, setCursor ] = useState({after: null, before: null})
  const [ nameFilter, setNameFilter ] = useState('')
  const { data, loading, error } = useQuery(TEAMS, {
    variables: {
      nameFilter,
      ...cursor,
      first: quantity,
      // last: quantity
    }
  })
  const { data: orgs } = useQuery(ORGANIZATIONS)
  const [ createTeam, { loading: creatingTeam } ] = useMutation(CREATE_TEAM)
  const [ organization, setOrganization ] = useState('')
  const [ name, setName ] = useState('')
  useEffect(() => {
    if(orgs && !!orgs.organizations.length) {
      setOrganization(orgs.organizations[0].id)
    }
  }, [orgs])
  const onCreateTeam = async () => {
    createTeam({
      variables: {
        organizationId: organization,
        name
      },
      optimisticResponse: {
        __typename: "Mutation",
        createTeam: {
          __typename: "Team",
          id: "-1",
          name
        }
      },
      update: (proxy, { data: { createTeam }}) => {
        const data = proxy.readQuery({ query: TEAMS })
        //@ts-ignore
        const newTeams = data.teams.slice()
        newTeams.push(createTeam)
        proxy.writeQuery({ query: TEAMS, data: { teams: newTeams } })
      }
    })
  }

  const teams = useMemo(() => {
    return getNodes(data)
  }, [data])
  const pageInfo = useMemo(() => {
    return teams.pageInfo
  }, [teams])

  const onSetCursor = async (action) => {
    if(action === 'BEFORE' && pageInfo.hasPreviousPage) {
      setCursor({ before: pageInfo.startCursor, after: null})
    }
    if(action === 'AFTER' && pageInfo.hasNextPage) {
      setCursor({ before: null, after: pageInfo.endCursor })
    }
  }
  const organizations = useMemo(() => {
    return getNodes(orgs)
  }, [orgs])
  console.log('TEAMS', teams.nodes)
  return({
    name,
    setName,
    organization,
    setOrganization,
    orgs: organizations.nodes,
    onCreateTeam,
    creatingTeam,
    teams: teams.nodes,
    loading,
    nameFilter,
    setNameFilter,
    onSetCursor,
    pageInfo
  })
}

export default Teams
