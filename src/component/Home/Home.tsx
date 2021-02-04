import Tab from '@jiesu12/react-tab'
import * as React from 'react'
import DoorCam from '../DoorCam/DoorCam'
import Garage from '../Garage/Garage'
import Temperature from '../Temperature/Temperature'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../reducer'
import { setCurrentTitle } from '../../action/home'
import { TAB_DOOR_CAM, TAB_GARAGE, TAB_TEMPERATURE } from '../constant/constant'

const Home = () => {
  const dispatch = useDispatch()
  const { currentTab } = useSelector((store: RootState) => store.home)
  return (
    <div className='smart-home'>
      <Tab
        tabs={[
          {
            title: TAB_DOOR_CAM,
            component: <DoorCam />,
            rerender: true,
          },
          {
            title: TAB_GARAGE,
            component: <Garage />,
            rerender: true,
          },
          {
            title: TAB_TEMPERATURE,
            component: <Temperature />,
            rerender: true,
          },
        ]}
        currentTitle={currentTab}
        setCurrentTitle={(title) => dispatch(setCurrentTitle(title))}
      />
    </div>
  )
}

export default Home
