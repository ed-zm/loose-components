import React, { useState, useEffect, useContext, useMemo } from 'react'
import axios from 'axios'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { USER, GET_S3_SIGNED_URL, CHANGE_PICTURE, UPDATE_PROFILE } from './index.graphql'
import { UIContext } from '../../../contexts/UI'
import { UserContext } from '../../../contexts/User'

const User = ({id }) => {
  const currentUser = useContext(UserContext)
  const isYou = currentUser.id === id
  const ui = useContext(UIContext);
  const [tab, setTab] = useState("TASKS");
  const [ picture, setPicture ] = useState({
    currentPicture: null,
    fileType: 'image/jpg',
  })
  const [ bio, setBio ] = useState('')
  const [ edit, setEdit ] = useState(false)
  const [ blob, setBlob ] = useState(null)
  const { currentPicture, fileType } = picture
  const { data, loading: userLoading } = useQuery(USER, { variables: { id } })
  const [ getS3SignedUrl, { data: s3Url, error, loading }] = useLazyQuery(GET_S3_SIGNED_URL)
  const [ changePicture ] = useMutation(CHANGE_PICTURE)
  const [ updateProfile, { loading: updatingProfile } ] = useMutation(UPDATE_PROFILE)
  const onUpdateProfile = async () => {
    await updateProfile({
      variables: {
        id,
        bio
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateUser: {
          __typename: "User",
          id,
          bio
        }
      }
    })
    await setBio('')
    await setEdit(false)
  }
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
      })
      .catch(() => {})
    }
  }, [s3Url])
  useEffect(() => {
    ui.actions.loading(userLoading)
  }, [userLoading])
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
  const user = useMemo(() => {
    if(data && data.user) {
      return data.user
    }
    return null
  }, [data])

  useEffect(() => {
    if(user) {setBio(user.biography)}
  }, [user])
  return {
    tab,
    setTab,
    user,
    loading,
    error,
    currentPicture,
    fileType,
    closeCropper,
    savePicture,
    changeProfilePicture,
    isYou,
    edit,
    setEdit,
    bio,
    setBio,
    onUpdateProfile,
    updatingProfile
  }
}

export default User
