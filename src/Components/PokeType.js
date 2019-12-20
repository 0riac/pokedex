import React from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { colors } from '../_helpers/constants'

const useStyles = makeStyles(theme => ({
  container: props => ({
    borderRadius: '3px',
    textAlign: 'center',
    cursor: props.clickHandler || props.pointer ? 'pointer' : 'default',
    color: props.color,
    background: props.background
  }),
  type: {
    width: '70px'
  },
  children: props => ({
    color: props.color
  })
}))

const PokeType = ({ type, children, clickHandler, pointer }) => {
  const { name } = type
  const { color, background } = (colors.find((item) => item[0] === name) && colors.find((item) => item[0] === name)[1]) || colors[0][1]
  const classes = useStyles({ color, background, clickHandler, pointer })

  return (
    <Box>
      <Grid onClick={(e) => clickHandler && clickHandler(e.target.innerText)} container className={classes.container} justify={'center'} alignItems={'center'}>
        <Grid item className={classes.type} >
          <Typography variant={'body2'}>{name}</Typography>
        </Grid>
        <Grid item className={classes.children}>
          {children}
        </Grid>
      </Grid>
    </Box>
  )
}

export default PokeType
