import Tab from '@jiesu12/react-tab'
import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TAB_DOOR_CAM, TAB_GARAGE, TAB_TEMPERATURE } from '../constant/constant'
import DoorCam from '../DoorCam/DoorCam'
import Garage from '../Garage/Garage'
import Temperature from '../Temperature/Temperature'

const Home = () => {
  const renderTabTitle = (title: string) => <Link to={`/fileswim/home?tab=${title}`}>{title}</Link>
  const tab = new URLSearchParams(useLocation().search).get('tab') || TAB_DOOR_CAM
  return (
    <div className='smart-home'>
      <Tab
        tabs={[
          {
            title: TAB_DOOR_CAM,
            component: <DoorCam />,
            rerender: true,
            titleRenderer: renderTabTitle,
          },
          {
            title: TAB_GARAGE,
            component: <Garage />,
            rerender: true,
            titleRenderer: renderTabTitle,
          },
          {
            title: TAB_TEMPERATURE,
            component: <Temperature />,
            rerender: true,
            titleRenderer: renderTabTitle,
          },
        ]}
        currentTitle={tab}
      />
    </div>
  )
}

export default Home
