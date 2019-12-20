import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import AppBar from '@material-ui/core/AppBar'
import Container from '@material-ui/core/Container'
import ToolBar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ExitToApp from '@material-ui/icons/ExitToApp'
import { withStyles } from '@material-ui/core/styles'

import { BP } from '../_helpers/constants'
import '../styles/Header.less'

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'unset'
  }
}

@inject('routing', 'userStore')
@observer
class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { classes, routing, userStore } = this.props
    const { params: { firstName, isAuthorized }, logout } = userStore
    const { push } = routing

    return (
      <AppBar position={'fixed'} className={classes.root}>
        <Container maxWidth={BP}>
          <ToolBar classes={{ root: 'app-width' }}>
            <Typography variant="h6" className={'header-title'} onClick={() => push('/')}>
              Pokedex
            </Typography>
            <Grid container alignItems={'center'} justify={'flex-end'} spacing={2}>
              {isAuthorized ? (
                <Grid item>
                  <Typography>
                    {firstName}
                  </Typography>
                </Grid>
              ) : null}
              <Grid item>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={() => push('profile')}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Grid>
              {isAuthorized ? (
                <Grid item>
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    onClick={() => {
                      logout()
                      push('/')
                    }}
                    color="inherit"
                  >
                    <ExitToApp />
                  </IconButton>
                </Grid>
              ) : null}
            </Grid>
          </ToolBar>
        </Container>
      </AppBar>
    )
  }
}

export default withStyles(styles)(Header)
