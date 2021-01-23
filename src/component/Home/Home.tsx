import Tab from '@jiesu12/react-tab'
import * as React from 'react'
import DoorCam from '../DoorCam/DoorCam'
import Garage from '../Garage/Garage'

const Home = () => {
  return (
    <div className='smart-home'>
      <Tab
        tabs={[
          {
            title: 'Door Cam',
            component: <DoorCam />,
            rerender: true,
          },
          {
            title: 'Garage',
            component: <Garage />,
            rerender: true,
          },
        ]}
      />
    </div>
  )
}

export default Home
