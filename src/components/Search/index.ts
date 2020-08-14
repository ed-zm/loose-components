import React, { useState, useEffect, useMemo, useContext } from 'react'
import moment from 'moment'
import { useLazyQuery } from '@apollo/react-hooks'
import { USERS_SEARCH } from './index.graphql'
import { UserContext } from '../../contexts/User'

const Search = ({ type, typeId }) => {
  const user = useContext(UserContext)
  const [ hint, setHint ] = useState('')
  const [ userSearch, { data, loading: searchingUsers, refetch } ] = useLazyQuery(USERS_SEARCH)
  useEffect(() => {
    if(hint.length > 2) {
      userSearch({
        variables: {
          type,
          hint,
          userId: user.id,
          now: moment(),
          typeId
        }
      })
    }
  }, [hint])
  const users = useMemo(() => {
    if(data) return data.users
    return []
  }, [data])
  const searching = searchingUsers
  return {
    hint,
    setHint,
    users,
    refetch,
    searching: searchingUsers
  }
}

export default Search
