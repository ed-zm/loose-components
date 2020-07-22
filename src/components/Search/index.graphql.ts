import gql from 'graphql-tag'

export const USERS_SEARCH = gql`
  query userSearch($hint: String!, $now: DateTime!, $userId: ID!, $type: InviteType!, $typeId: ID!) {
    users(
      where: {
        id_not: $userId,
        receivedInvites_every: {
          expireAt_gt: $now
        },
        receivedInvites_none: {
          typeId: $typeId,
          type: $type,
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
