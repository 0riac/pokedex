import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { inject, observer } from 'mobx-react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Card from './Card'
import { BP } from '../_helpers/constants'
import { set } from 'mobx'

const styles = {
  formControl: {
    minWidth: 120,
    flexGrow: 1
  },
  searchField: {
    minWidth: '200px',
    flexGrow: 100,
    display: 'flex'
  },
  gridForm: {
    display: 'flex',
    flexGrow: 1
  },
  closeButton: {
    padding: '0'
  },
  closeIcon: {
    width: '0.75em'
  },
  listTypes: {
    display: 'flex',
    width: '100%',
    height: '100%',
    padding: '6px 16px'
  }
}

@inject('filterStore', 'userStore')
@observer
class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.setState({ labelWidth: this.inputLabel ? this.inputLabel.offsetWidth : 0 })
  }

  handleChange (event) {
    const limit = event.target.value
    set(this.props.userStore.params, 'limit', limit)
  }

  render () {
    const { userStore, classes } = this.props
    const { favoritePokemons, pokemonArray, next, back, setUser } = userStore
    const { isAuthorized, limit, offset, pokemonCount } = userStore.params

    return (
      <Container maxWidth={BP}>
        {isAuthorized ? (
          <>
            <Box mt={2}>
              <Grid container alignItems={'center'} spacing={2}>
                <Grid item className={classes.searchField}>
                  <Typography variant={'h6'}>
                    Your favorite pokemons
                  </Typography>
                </Grid>
                <Grid item className={classes.gridForm}>
                  <FormControl variant="outlined" className={classes.formControl} size={'small'}>
                    <InputLabel ref={(ref) => this.inputLabel = ref} id="select-outlined-label">
                      Result per page
                    </InputLabel>
                    <Select
                      labelId="select-outlined-label"
                      id="select-outlined"
                      value={limit}
                      onChange={(e) => this.handleChange(e)}
                      labelWidth={this.state.labelWidth}
                    >
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <Box mt={1}>
              <Grid
                container
                spacing={2}
              >
                {pokemonArray && pokemonArray.map((item) => (<Grid
                  key={item.id}
                  item
                  xl={3}
                  md={4}
                  sm={6}
                  xs={12}
                >
                  <Card
                    id={item.id}
                    name={item.name}
                    types={item.types}
                    image={item.sprites.front_default}
                    favorite={favoritePokemons.find((id) => +id === item.id)}
                    setUser={setUser}
                  />
                </Grid>)
                )}
              </Grid>
            </Box>
            <Box mt={2}>
              <Grid
                container
                justify={'center'}
                spacing={4}
              >
                <Grid item>
                  <Button
                    size={'large'}
                    disabled={!offset}
                    onClick={() => back()}
                  >
                    Back
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size={'large'}
                    disabled={pokemonCount < offset + limit}
                    onClick={() => next()}
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </>) : <Redirect to={'/login'}/>}
      </Container>
    )
  }
}

export default withStyles(styles)(Profile)
