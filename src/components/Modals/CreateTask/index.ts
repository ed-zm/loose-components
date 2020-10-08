import React, { Fragment, useState, useEffect, useMemo, useContext } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { CREATE_TASK, ORGANIZATIONS, TEAMS } from './index.graphql'
import { TASKS } from '../../Lists/Tasks/index.graphql'
import { UserContext } from '../../../contexts/User'
import { TaskContext } from '../../../contexts/Task'

const CreateTask = ({ tasks, variables, callback = () => {} }) => {
  const user = useContext(UserContext)
  const task = useContext(TaskContext)
  const [ createTask, { loading: creatingTask } ] = useMutation(CREATE_TASK)
  const [ fetchTeams, { loading: fetchingTeams, error: fetchTeamsError, data: fetchTeamsData }] = useLazyQuery(TEAMS)
  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ organization, setOrganization ] = useState('')
  const [ team, setTeam ] = useState('')
  const [ estimated, setEstimated ] = useState(0)
  const [ teamTask, setTeamTask ] = useState(false)
  const [ assignTo, setAssignTo ] = useState(null)
  const [ priority, setPriority ] = useState(0)
  const useDraft = async (draft) => {
    await setTitle(draft.title)
    await setTeam(draft.team)
    await setEstimated(draft.estimated)
    await setDescription(draft.description)
    await setTeamTask(draft.teamTask)
    await setOrganization(draft.organization)
    await setAssignTo(draft.assignTo)
    task.actions.clearDraft()
  }
  const onCreateTask = async () => {
    const createVariables: CreateTaskVariables = {
      title: title.toLowerCase(),
      description,
      state: 0,
      estimated,
      priority: parseInt(priority, 10),
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
        createOneTask: {
          __typename: "Task",
          id: "-1",
          title: title.toLowerCase(),
          state: 0,
          estimated,
          priority: parseInt(priority, 10),
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
          createdAt: new Date().toISOString(),
          snoozedUntil: new Date().toISOString()
        }
      },
      update: (proxy, { data: { createOneTask }}) => {
        const data = proxy.readQuery({ query: TASKS, variables })
        const newTasks = data.tasks.slice()
        newTasks.unshift(createOneTask)
        proxy.writeQuery({ query: TASKS, variables, data: { tasks: newTasks } })
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
    assignTo,
    useDraft,
    priority,
    setPriority
  }
}

export default CreateTask
