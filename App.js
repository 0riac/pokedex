import React from 'react'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { Router } from 'react-router'
import AppWrapper from './src'
import mainStore from './src/store'

const browserHistory = createBrowserHistory({ basename: '/pokedex' })
const routingStore = new RouterStore()

const stores = {
  // Key can be whatever you want
  routing: routingStore,
  mainStore,
  filterStore: mainStore.filterStore,
  userStore: mainStore.userStore
  // ...other stores
}

const history = syncHistoryWithStore(browserHistory, routingStore)

function App () {
  return (
    <Provider {...stores}>
      <Router history={history}>
        <AppWrapper />
      </Router>
    </Provider>
  )
}

export default App
