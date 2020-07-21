import gql from 'graphql-tag'

export const USERS_SEARCH = gql`
  query userSearch($hint: String!, $now: DateTime!, $userId: ID!, $type: InviteType!) {
    users(
      where: {
        id_not: $userId,
        receivedInvites_every: {
          expireAt_gt: $now,
          type: $type
        },
        receivedInvites_none: {
          from: {
            id: $userId
          }
        },
        OR: [
          { firstName_contains: $hint },
          { lastName_contains: $hint }
        ]
      }
    ) {
      id
      firstName
      lastName
      avatar
      receivedInvites {
        id
      }
    }
  }
`
