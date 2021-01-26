import * as React from 'react'
import './DoorCam.scss'
import { getJson } from '@jiesu12/fileswim-api'

const CAM_URL = 'https://cam1.javaswim.com'
const CAM_CONTROL_URL = 'https://cam1control.javaswim.com'

const DoorCam = () => {
  const [showCam, setShowCam] = React.useState<boolean>(false)
  const dayVision = () => {
    getJson(`${CAM_CONTROL_URL}/irswitch/on`)
  }

  const nightVision = () => {
    getJson(`${CAM_CONTROL_URL}/irswitch/off`)
  }

  return (
    <div className='door-cam'>
      <div className='cam-control'>
        <button className='show-cam btn btn-sm btn-primary' onClick={() => setShowCam(!showCam)}>
          {showCam ? 'Hide' : 'Show'} Camera
        </button>
        <div className='vision-switch'>
          <button className='day-vision btn btn-sm btn-outline-success' onClick={dayVision}>
            Day
          </button>
          <button className='night-vision btn btn-sm btn-outline-secondary' onClick={nightVision}>
            Night
          </button>
        </div>
      </div>
      <div className='cam'>
        {showCam && <img src={`${CAM_URL}/stream/video.mjpeg`} alt='image' />}
      </div>
    </div>
  )
}

export default DoorCam
