import * as React from 'react'
import './FrontDoor.scss'
import { getJson } from '@jiesu12/fileswim-api'

const CAM_URL = 'https://cam1.javaswim.com'
const CAM_CONTROL_URL = 'https://cam1control.javaswim.com'

const FrontDoor = () => {
  const [showCam, setShowCam] = React.useState<boolean>(false)
  const dayVision = () => {
    getJson(`${CAM_CONTROL_URL}/irswitch/on`)
  }

  const nightVision = () => {
    getJson(`${CAM_CONTROL_URL}/irswitch/off`)
  }

  return (
    <div className='front-door'>
      <div className='cam-control'>
        <div className='play-div'>
          <button className='show-cam btn btn-sm btn-primary' onClick={() => setShowCam(!showCam)}>
            {showCam ? 'Hide' : 'Show'} Camera
          </button>
          <a className='recordings' href='/fileswim/filemanager?instance=camera&path=frontdoor'>
            Check Recordings
          </a>
        </div>
        <div className='vision-switch'>
          <button className='day-vision btn btn-sm btn-outline-success' onClick={dayVision}>
            Day
          </button>
          <button className='night-vision btn btn-sm btn-outline-secondary' onClick={nightVision}>
            Night
          </button>
        </div>
      </div>
      <div className='cam'>{showCam && <img src={`${CAM_URL}/?action=stream`} alt='image' />}</div>
    </div>
  )
}

export default FrontDoor
