import { createReducer } from '@reduxjs/toolkit'
import { TAB_DOOR_CAM } from '../component/constant/constant'
import { setCurrentTitle } from '../action/home'

export interface HomeState {
  currentTab: string
}

const INIT_STATE: HomeState = {
  currentTab: TAB_DOOR_CAM,
}

export default createReducer(INIT_STATE, (builder) => {
  builder.addCase(setCurrentTitle, (state, action) => {
    state.currentTab = action.payload
  })
})
