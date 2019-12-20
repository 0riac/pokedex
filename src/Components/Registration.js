import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { inject, observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'
import GitHub from '@material-ui/icons/GitHub'
import Formsy from 'formsy-react'
import axios from 'axios'
import { BP, API } from '../_helpers/constants'
import Input from './Input'

const styles = {
  container: {
  },
  boxContainer: {
    height: '100%',
    display: 'flex'
  },
  divContainer: {
    margin: '0 auto'
  },
  buttonGrid: {
    width: '100%'
  }
}

@inject('routing', 'userStore')
@observer
class Registration extends Component {
  constructor (props) {
    super(props)
    this.state = { loading: false }
  }

  submit (model, reset) {
    this.setState({ loading: true, registrationFailed: false })
    axios.post(`${API}user/`, {
      email: model.email,
      password: model.password,
      firstName: model.firstName,
      lastName: model.lastName
    }, { withCredentials: true })
      .then((res) => {
        this.props.userStore.setUser(res.data)
      })
      .catch((err) => {
        console.log(err)
        this.setState({ registrationFailed: true, loading: false })
        reset()
      })
  }

  render () {
    const { classes, userStore, routing: { push } } = this.props
    const { params: { isAuthorized } } = userStore
    return (
      <>
        {isAuthorized ? <Redirect to={'/'}/> : null}
        <Container className={classes.container} maxWidth={BP}>
          <Box mt={18} className={classes.boxContainer}>
            <div className={classes.divContainer}>
              <Paper>
                <Box pt={0} pb={10} px={5}>
                  <Formsy onValidSubmit={this.submit.bind(this)}>
                    <Grid
                      container
                      alignItems={'center'}
                      direction={'column'}
                      spacing={2}>
                      <Grid item>
                        <Box pt={3} pb={3}>
                          <Typography variant={'h5'}>
                            Pokedex
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Grid container spacing={1}>
                          <Grid item>
                            <IconButton href={`${API}auth/github`} color={'inherit'}><GitHub/></IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                      {this.state.registrationFailed ? <Typography>registration failed</Typography> : null}
                      {!this.state.loading ? (
                        <>
                          <Grid item>
                            <Input
                              id="firstName"
                              name='firstName'
                              required
                              label="First Name"
                              defaultValue=""
                              variant="outlined"
                              size={'small'}
                            />
                          </Grid>
                          <Grid item>
                            <Input
                              id="lastName"
                              name='lastName'
                              label="Last Name"
                              defaultValue=""
                              variant="outlined"
                              size={'small'}
                            />
                          </Grid>
                          <Grid item>
                            <Input
                              id="email"
                              name='email'
                              autoComplete="email"
                              required
                              label="Email"
                              defaultValue=""
                              variant="outlined"
                              size={'small'}
                            />
                          </Grid>
                          <Grid item>
                            <Input
                              required
                              name="password"
                              label="Password"
                              type="password"
                              id="password"
                              defaultValue=""
                              variant="outlined"
                              size={'small'}
                            />
                          </Grid>
                          <Grid item className={classes.buttonGrid}>
                            <Grid container justify={'space-between'}>
                              <Grid item>
                                <Button
                                  variant={'outlined'}
                                  size={'small'}
                                  onClick={() => push('/login')}
                                >
                                  Login
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button variant="contained" color="primary" size={'small'} type="submit">
                                  Registration
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </>) : <Box mx={11.5} my={7}><CircularProgress /></Box>}
                    </Grid>
                  </Formsy>
                </Box>
              </Paper>
            </div>
          </Box>
        </Container>
      </>
    )
  }
}

export default withStyles(styles)(Registration)
