import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { USER, GET_S3_SIGNED_URL, CHANGE_PICTURE, USER_TEAMS } from './index.graphql'
import { UIContext } from '../../../contexts/UI'

const User = ({id }) => {
  const ui = useContext(UIContext);
  console.log('UI', ui)
  const [tab, setTab] = useState("TEAMS");
  const [user, setUser ] = useState(null)
  const [teams, setTeams ] = useState([])
  const [ picture, setPicture ] = useState({
    currentPicture: null,
    fileType: 'image/jpg',
  })
  const [ blob, setBlob ] = useState(null)
  const { currentPicture, fileType } = picture
  const { data, loading: userLoading } = useQuery(USER, { variables: { id } })
  // console.log('USER LOADING 1', userLoading, data)
  const [ getS3SignedUrl, { data: s3Url, error, loading }] = useLazyQuery(GET_S3_SIGNED_URL)
  const [ fetchTeams, { data: teamsData, error: teamsError, loading: loadingTeams }] = useLazyQuery(USER_TEAMS)

  const [ changePicture ] = useMutation(CHANGE_PICTURE)
  useEffect(() => {
    if(data && data.user) {
      setUser(data.user)
    }
  }, [data])
  useEffect(() => {
    // console.log('USER LOADING 2', userLoading, ui)
    if(ui.loading !== userLoading) {
      // ui.actions.loading(!loading)
    }
  }, [userLoading])
  useEffect(() => {
    if(teamsData && teamsData.teams) setTeams(teamsData.teams)
  })
  useEffect(() => {
    let s3Key
    if(s3Url) {
      const extension = picture.fileType.split('/')
      s3Key = `${data.user.id}.${extension[1]}`
      new Promise( async resolve => {
        const res = await axios.put(s3Url.getS3SignedUrl, blob, { headers: { 'Content-Type': fileType } })
        resolve(res)
      })
      .then((res: any) => {
        if(res.status === 200) {
          return changePicture({
            variables: {
              id: data.user.id,
              avatar: `https://s3.eu-west-1.amazonaws.com/dev.loose.www.avatars/${s3Key}`
            }
          })
        } else {
          throw new Error('An error occured uploading your image')
        }
      })
      .then(async res => {
        await setPicture({currentPicture: null, fileType: 'image/jpg'})
        await setBlob(null)
        console.log('Success')
      })
      .catch(() => {})
    }
  }, [s3Url])
  useEffect(() => {
    if(user) {
      fetchTeams({ variables: { userId: data.user.id }})
    }
  }, [tab])
  const changeProfilePicture = async picture => {
    const file = picture.map(res => res[0].target.result)
    const currentPicture = file && file[0]
    await setPicture({currentPicture, fileType: picture[0][1].type})

  }

  const savePicture = async (blob) => {
    await setBlob(blob)
    await getS3SignedUrl({
      variables: {
        operation: 'putObject',
        fileType: fileType,
        id: data.user.id
      }
    })
  }
  const closeCropper = async () => {
    setPicture({currentPicture: null, fileType: 'image/jpg'})
  }
  return {
    tab,
    setTab,
    user,
    loading,
    error,
    loadingTeams,
    teamsError,
    teams,
    currentPicture,
    fileType,
    closeCropper,
    savePicture,
    changeProfilePicture
  }
}

export default User
