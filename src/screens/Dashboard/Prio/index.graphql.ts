import gql from 'graphql-tag'

export const PRIO_TASKS = gql`
  query prioTasks(
    $where: TaskWhereInput,
    $orderBy: [TaskOrderByInput!]
  ) {
    tasks(
      where: $where,
      first: 1,
      orderBy: $orderBy
    ) {
      id
      title
      description
      estimated
      state
      code
      snoozedUntil
      priority
      createdBy {
        id
        firstName
        lastName
        username
        avatar
      }
      assignedTo {
        id
        firstName
        lastName
        username
        avatar
      }
      organization {
        id
      }
      team {
        id
      }
      createdAt
    }
  }
`

export const SNOOZE_TASK = gql`
  mutation ($taskId: String!, $data: TaskUpdateInput!) {
    updateOneTask(
      where: {
        id: $taskId
      },
      data: $data
    ) {
      id
      priority
      snoozedUntil
    }
  }
`
