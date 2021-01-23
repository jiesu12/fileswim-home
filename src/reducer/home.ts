import { createReducer } from '@reduxjs/toolkit'
import { TAB_DOOR_CAM } from '../component/constant/constant'

export interface HomeState {
  currentTab: string
}

const INIT_STATE: HomeState = {
  currentTab: TAB_DOOR_CAM,
}

export default createReducer(INIT_STATE, (builder) => {
  console.log()
})
