import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { CREATE_TEAM, ORGANIZATIONS } from './index.graphql'
import { TEAMS } from '../../Lists/Teams/index.graphql'
import { UserContext } from '../../../contexts/User'

const CreateTeam = ({ variables }) => {
  const user = useContext(UserContext)
  const { data: orgs } = useQuery(ORGANIZATIONS)
  const [ createTeam, { loading: creatingTeam } ] = useMutation(CREATE_TEAM)
  const [ organization, setOrganization ] = useState('')
  const [ name, setName ] = useState('')
  const onCreateTeam = async ({ variables }) => {
    createTeam({
      variables: {
        organizationId: organization,
        name
      },
      optimisticResponse: {
        __typename: "Mutation",
        createOneTeam: {
          __typename: "Team",
          id: "-1",
          name,
          users: []
        }
      },
      update: (proxy, { data: { createOneTeam }}) => {
        const data = proxy.readQuery({ query: TEAMS, variables })
        const newTeams = data.teams.slice()
        newTeams.unshift(createOneTeam)
        proxy.writeQuery({ query: TEAMS, variables, data: { teams: newTeams } })
      }
    })
  }
  const organizations = useMemo(() => {
    if(orgs && orgs.organizations) return orgs.organizations
    return []
  }, [orgs])
  useEffect(() => {
    if(!!organizations.length) {
      setOrganization(organizations[0].id)
    }
  }, [organizations])
  return({
    name,
    setName,
    organization,
    setOrganization,
    orgs: organizations,
    onCreateTeam,
    creatingTeam
  })
}

export default CreateTeam
