import { createAction } from '@reduxjs/toolkit'

export const setSearchKeyword = createAction<string>('accounts::searchKeyword')

export const setSelectedId = createAction<number>('accounts::selectedId')
