import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FileReaderInput from 'react-file-reader-input'
import { useRouter } from 'next/router'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { USER, GET_S3_SIGNED_URL, CHANGE_PICTURE } from './index.graphql'
import Cropper from '../../../components/Cropper'

const User = () => {
  const router = useRouter()
  const { id } = router.query
  const [ picture, setPicture ] = useState({
    currentPicture: null,
    fileType: 'image/jpg',
  })
  const [ openCropper, setOpenCropper ] = useState(false)
  const { currentPicture, fileType } = picture
  const { data } = useQuery(USER, { variables: { id } })
  const [ getS3SignedUrl, { data: s3Url, error, loading }] = useLazyQuery(GET_S3_SIGNED_URL)
  const [ changePicture ] = useMutation(CHANGE_PICTURE)
  useEffect(() => {
    let s3Key
    if(s3Url) {
      const extension = picture.fileType.split('/')
      s3Key = `${data.user.id}.${extension[1]}`
      new Promise( async resolve => {
        const res = await axios.put(s3Url.getS3SignedUrl, picture.currentPicture, { headers: { 'Content-Type': fileType } })
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
      console.log('Success')
      })
      .catch(() => {})
    }
  }, [s3Url])

  const changeProfilePicture = picture => {
    const file = picture.map(res => res[0].target.result)
    const currentPicture = file && file[0]
    setPicture({currentPicture, fileType: picture[0][1].type})
  }

  const savePicture = async (blob) => {
    await getS3SignedUrl({
      variables: {
        operation: 'putObject',
        fileType: fileType,
        id: data.user.id
      }
    })
  }
  return(
    <div>
        {data && data.user &&
          <div>
            <img src = {data.user.avatar || '/static/default_profile.png'} width = {30} height = {30}/>
            <div>{ data.user.email }</div>
            <div>{ data.user.username }</div>
            <div>{ data.user.firstName }</div>
            <div>{ data.user.lastName }</div>
              <FileReaderInput type='file' onChange={ (e, pic) => changeProfilePicture(pic) } />
          </div>
        }
        { currentPicture && fileType && <Cropper closeCropper = { async () => {
          setPicture({currentPicture: null, fileType: 'image/jpg'})
        } } src = { currentPicture } fileType = { fileType } savePicture = { savePicture }/> }
    </div>
  )
}

export default User