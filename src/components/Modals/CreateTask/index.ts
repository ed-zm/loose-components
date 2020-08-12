import React, { Fragment, useState, useEffect, useMemo, useContext } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { CREATE_TASK, ORGANIZATIONS, TEAMS } from './index.graphql'
import { TASKS } from '../../Lists/Tasks/index.graphql'
import { UserContext } from '../../../contexts/User'

const CreateTask = ({ tasks, variables, callback = () => {} }) => {
  const user = useContext(UserContext)
  const [ createTask, { loading: creatingTask } ] = useMutation(CREATE_TASK)
  const [ fetchTeams, { loading: fetchingTeams, error: fetchTeamsError, data: fetchTeamsData }] = useLazyQuery(TEAMS)
  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ organization, setOrganization ] = useState('')
  const [ team, setTeam ] = useState('')
  const [ estimated, setEstimated ] = useState(0)
  const [ teamTask, setTeamTask ] = useState(false)
  const [ assignTo, setAssignTo ] = useState(null)
  const onCreateTask = async () => {
    const createVariables: CreateTaskVariables = {
      title: title.toLowerCase(),
      description,
      state: 0,
      estimated,
      createdBy: { connect: { id: user.id } },
    }
    if(!!assignTo && !teamTask) createVariables.assignedTo = { connect : { id: assignTo.id } }
    if(organization) createVariables.organization = { connect: { id: organization }}
    else {
      createVariables.assignedTo = { connect : { id: user.id } }
    }
    if(team) createVariables.team = { connect: { id: team }}
    await createTask({
      variables: { data: createVariables },
      optimisticResponse: {
        __typename: "Mutation",
        createTask: {
          __typename: "Task",
          id: "-1",
          title: title.toLowerCase(),
          state: 0,
          estimated,
          code: 'AAAA',
          description,
          createdBy: {
            __typename: "User",
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            username: user.username
          },
          assignedTo: assignTo ?{
            __typename: "User",
            id: assignTo.id,
            firstName: assignTo.firstName,
            lastName: assignTo.lastName,
            username: assignTo.username,
            avatar: assignTo.avatar
          } : null,
          organization: !organization ? null : {
            __typename: "Organization",
            id: organization
          },
          team: !team ? null : {
            __typename: "Team",
            id: team
          },
          createdAt: new Date().toISOString()
        }
      },
      update: (proxy, { data: { createTask }}) => {
        const data = proxy.readQuery({ query: TASKS, variables })
        const newTasks = data.tasks.edges.slice()
        newTasks.unshift({ node: createTask, __typename: "TaskEdge" })
        proxy.writeQuery({ query: TASKS, variables, data: { tasks: { ...data.tasks, edges: newTasks } } })
      }
    })
    await setTitle('')
    await setDescription('')
    await setOrganization('')
    await setEstimated(0)
    await callback()
  }
  useEffect(() => {
    if(teamTask && !!organization) {
      fetchTeams({
        variables: {
          organizationId: organization
        }
      })
    }
  }, [teamTask])
  const teams = useMemo(() => {
    if(!!fetchTeamsData && !!fetchTeamsData.teams.length) {
      return fetchTeamsData.teams
    }
    else return []
  }, [fetchTeamsData])
  useEffect(() => {
    if(!!teams.length) setTeam(teams[0].id)
  }, [teams])
  return {
    team,
    setTeam,
    teams,
    fetchTeamsError,
    fetchingTeams,
    onCreateTask,
    title,
    setTitle,
    estimated,
    setEstimated,
    description,
    setDescription,
    teamTask,
    setTeamTask,
    organization,
    setOrganization,
    creatingTask,
    setAssignTo,
    assignTo
  }
}

export default CreateTask
