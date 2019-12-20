import React, { Component } from 'react'
import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { ThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'
import { colors } from '../_helpers/constants'
import PokeType from './PokeType'
import { inject, observer } from 'mobx-react'
import { set, get, remove } from 'mobx'

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

const theme = createMuiTheme(({
  overrides: {
    MuiAutocomplete: {
      listbox: {
        '&> li': {
          padding: '0'
        }
      }
    }
  }
}))

@inject('routing', 'filterStore')
@observer
class Filter extends Component {
  constructor (props) {
    super(props)
    this.state = { count: 20, types: ['poison', 'grass', 'fire', 'dark'], isOpen: false }
  }

  componentDidMount () {
    this.setState({ labelWidth: this.inputLabel.offsetWidth })
  }

  handleChange (event) {
    const limit = event.target.value
    set(this.props.filterStore.params, 'limit', limit)
  }

  render () {
    const { classes, filterStore } = this.props
    const { pokeTypes, params, changeSearch } = filterStore
    const limit = get(params, 'limit')

    return (
      <Box mt={2}>
        <Grid container alignItems={'center'} spacing={2}>
          <Grid item className={classes.searchField}>
            <ThemeProvider theme={theme}>
              <Autocomplete
                freeSolo
                className={classes.searchField}
                id="combo-box"
                open={this.state.isOpen}
                onOpen={() => this.setState({ isOpen: true })}
                onClose={() => this.setState({ isOpen: false })}
                onChange={(e) => changeSearch(e.target.value)}
                options={colors.map(item => item[0])}
                disableOpenOnFocus
                renderOption={option => (<div
                  className={classes.listTypes}
                  onClick={(e) => {
                    set(pokeTypes, e.target.innerText)
                    this.setState({ isOpen: false })
                    e.stopPropagation()
                  }}>
                  <PokeType type={{ name: option }} pointer/></div>)}
                renderInput={params => (<TextField
                  {...params}
                  label="Search field"
                  variant="outlined"
                  fullWidth
                  size={'small'}
                />)
                }
              />
            </ThemeProvider>
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
        <Box mt={1}>
          <Grid container spacing={2}>
            {[...pokeTypes].map((item, i) => (<Grid item key={item}>
              <PokeType type={{ name: item }}>
                <Box mr={0.5}>
                  <IconButton onClick={() => remove(pokeTypes, item)} className={classes.closeButton} color={'inherit'}>
                    <CloseIcon className={classes.closeIcon}/>
                  </IconButton>
                </Box>
              </PokeType>
            </Grid>))}
          </Grid>
        </Box>
      </Box>
    )
  }
}

export default withStyles(styles)(Filter)
