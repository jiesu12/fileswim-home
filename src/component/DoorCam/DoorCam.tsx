import * as React from 'react'
import './DoorCam.scss'
import { getJson } from '@jiesu12/fileswim-api'

const DoorCam = () => {
  const [showCam, setShowCam] = React.useState<boolean>(false)
  const dayVision = () => {
    getJson('https://doorcamcontrol.javaswim.com/irswitch/on')
  }

  const nightVision = () => {
    getJson('https://doorcamcontrol.javaswim.com/irswitch/off')
  }

  return (
    <div className='door-cam'>
      <div className='cam-control'>
        <button className='show-cam btn btn-primary' onClick={() => setShowCam(!showCam)}>
          {showCam ? 'Hide' : 'Show'} Camera
        </button>
        <button className='day-vision btn btn-primary' onClick={dayVision}>
          Day Vision
        </button>
        <button className='night-vision btn btn-primary' onClick={nightVision}>
          Night Vision
        </button>
      </div>
      <div className='cam'>
        {showCam && <img src='https://doorcam.javaswim.com/stream/video.mjpeg' alt='image' />}
      </div>
    </div>
  )
}

export default DoorCam
