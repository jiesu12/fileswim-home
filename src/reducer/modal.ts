import { createReducer } from '@reduxjs/toolkit'
import { closeModal, openModal } from '../action/modal'
import React = require('react')

const INIT_STATE: ModalStoreState = {
  show: false,
}

export interface ModalState {
  child: React.ReactNode
  title: string
}

export interface ModalStoreState {
  show: boolean
  modal?: ModalState
}

export default createReducer(INIT_STATE, (builder) => {
  builder.addCase(openModal, (state, action) => {
    state.show = true
    state.modal = action.payload
  })

  builder.addCase(closeModal, (state) => {
    state.show = false
    state.modal = null
  })
})
