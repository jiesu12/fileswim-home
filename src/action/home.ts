import { getServices, getTextFile } from '@jiesu12/fileswim-api'
import { TextFile } from '@jiesu12/fileswim-api/lib/dto'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { ACCOUNT_FILE_NAME, INSTANCE_NAME } from '../constant/constant'

export const getAccounts = createAsyncThunk<TextFile>('account::getAll', async () => {
  return await getServices('fileservice')
    .then((instances) => instances.find((i) => i.name === INSTANCE_NAME))
    .then((instance) => getTextFile(instance, ACCOUNT_FILE_NAME))
})

export const setSearchKeyword = createAction<string>('accounts::searchKeyword')

export const setSelectedId = createAction<number>('accounts::selectedId')
