import { createAction } from '@reduxjs/toolkit'
import { ModalState } from '../reducer/modal'

export const openModal = createAction<ModalState>('modal::open')

export const closeModal = createAction('modal::close')
