import { postJson } from '@jiesu12/fileswim-api'
import DropdownMenu from '@jiesu12/react-dropdown-menu'
import * as React from 'react'
import './FrontDoor.scss'

const CAM_URL = 'https://cam1.javaswim.com'

const FrontDoor = () => {
  const dayVision = () => {
    postJson(`${CAM_URL}/irswitch/on`)
  }

  const nightVision = () => {
    postJson(`${CAM_URL}/irswitch/off`)
  }

  return (
    <div className='front-door'>
      <DropdownMenu
        showTitle={false}
        title={'Menu'}
        rightHandSide={false}
        menuItems={[
          { key: 'Day Vision', onClick: dayVision },
          { key: 'Night Vision', onClick: nightVision },
          {
            key: 'Recordings',
            display: (
              <a
                className='menu-item'
                href='/fileswim/filemanager?instance=camera&path=frontdoor.lan'
              >
                Check Recordings
              </a>
            ),
            onClick: null,
          },
        ]}
      />
      <div className='cam'>
        <img src={`${CAM_URL}/stream`} alt='image' />
        <img src='https://cam3.javaswim.com/video' alt='image' />
      </div>
    </div>
  )
}

export default FrontDoor
