import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import Box from '@material-ui/core/Box'
import Pokedex from './Components/Pokedex'
import Profile from './Components/Profile'
import Login from './Components/Login'
import Registration from './Components/Registration'

import Header from './Components/Header'
import './styles/index.less'

class AppWrapper extends Component {
  render () {
    return (
      <div className='app'>
        <Header />
        <Box mt={10}>
          <Switch>
            <Route exact path={'/'} component={Pokedex}/>
            <Route path={'/profile'} component={Profile}/>
            <Route path={'/login'} component={Login}/>
            <Route path={'/registration'} component={Registration}/>
          </Switch>
        </Box>
      </div>
    )
  }
}

export default AppWrapper
