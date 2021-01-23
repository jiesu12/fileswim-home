import HistoryDispatcher from '@jiesu12/history-dispatcher'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './component/Home/Home'
import './index.scss'
import { configureStore } from './reducer'

ReactDOM.render(
  <Provider store={configureStore()}>
    <Router>
      <Switch>
        <Route path='/fileswim/home' component={Home} />
      </Switch>
      <HistoryDispatcher />
    </Router>
  </Provider>,
  document.getElementById('root')
)
