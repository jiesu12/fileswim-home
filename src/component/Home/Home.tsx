import Tab from '@jiesu12/react-tab'
import * as React from 'react'
import DoorCam from '../DoorCam/DoorCam'
import Garage from '../Garage/Garage'
import Temperature from '../Temperature/Temperature'

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
          {
            title: 'Temperature',
            component: <Temperature />,
            rerender: true,
          },
        ]}
      />
    </div>
  )
}

export default Home
