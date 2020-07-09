import React, { useState, useEffect, useContext, useMemo } from 'react'
import Link from 'next/link'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { TEAMS, CREATE_TEAM, ORGANIZATIONS } from './index.graphql'
import { UserContext } from '../../../contexts/User'

const Teams = () => {
  const user = useContext(UserContext)
  const { data, loading, error } = useQuery(TEAMS)
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
    if(data && data.teams) return data.teams
    return []
  })
  return({
    name,
    setName,
    organization,
    setOrganization,
    orgs,
    onCreateTeam,
    creatingTeam,
    teams,
    loading
  })
}

export default Teams
