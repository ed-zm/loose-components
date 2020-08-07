import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { CREATE_TEAM, ORGANIZATIONS } from './index.graphql'
import { TEAMS } from '../../Lists/Teams/index.graphql'
import { UserContext } from '../../../contexts/User'
import getNodes from '../../../utils/getNodes'

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
        createTeam: {
          __typename: "Team",
          id: "-1",
          name,
          users: []
        }
      },
      update: (proxy, { data: { createTeam }}) => {
        const data = proxy.readQuery({ query: TEAMS, variables })
        //@ts-ignore
        const newTeams = data.teams.edges.slice()
        newTeams.unshift({ node: createTeam, __typename: "TeamEdge" })
        proxy.writeQuery({ query: TEAMS, variables, data: { teams: { ...data.teams, edges: newTeams} } })
      }
    })
  }
  const organizations = useMemo(() => {
    return getNodes(orgs)
  }, [orgs])
  useEffect(() => {
    console.log('USE EFFECT',organizations)
    if(!!organizations.nodes.length) {
      setOrganization(organizations.nodes[0].id)
    }
  }, [organizations])
  return({
    name,
    setName,
    organization,
    setOrganization,
    orgs: organizations.nodes,
    onCreateTeam,
    creatingTeam
  })
}

export default CreateTeam
