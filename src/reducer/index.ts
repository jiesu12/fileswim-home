import { applyMiddleware, combineReducers, createStore, Store } from 'redux'
import thunk from 'redux-thunk'
import home from './home'
import modal from './modal'

const rootReducer = combineReducers({ home, modal })

export type RootState = ReturnType<typeof rootReducer>

export const configureStore = (): Store => {
  const store = createStore(rootReducer, applyMiddleware(thunk))
  return store
}
