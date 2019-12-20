import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import axios from 'axios'

import StarBorderRounded from '@material-ui/icons/StarBorderRounded'
import StarRounded from '@material-ui/icons/StarRounded'

import PokeType from './PokeType'
import { API } from '../_helpers/constants'

const useStyles = makeStyles(theme => ({
  card: {
    position: 'relative',
    minWidth: 100
  },
  media: {
    height: 0,
    paddingTop: '56.25%'
  },
  favorite: props => ({
    color: props.favorite ? '#ffd700' : 'rgba(0, 0, 0, 0.26)'
  }),
  favoriteButton: {
    position: 'absolute',
    right: '5px',
    top: '5px'
  }
}))

const PokemonCard = ({ name, id, types, image, favorite, typeToFilter, setUser, push }) => {
  const [initFav, setInitFav] = useState({ value: favorite })
  const [fav, setFav] = useState({ value: favorite, changed: false })
  const classes = useStyles({ favorite: fav.value })

  useEffect(() => {
    if (initFav !== favorite) {
      setInitFav(favorite)
      setFav({ value: favorite })
    }
  })

  useEffect(() => {
    (async () => {
      try {
        if (fav.changed) {
          switch (fav.value) {
            case true: {
              const user = await axios.post(`${API}user/pokemon/${id}`, {}, { withCredentials: true })
              setUser(user.data)
              break
            }
            case false: {
              const user = await axios.delete(`${API}user/pokemon/${id}`, { withCredentials: true })
              setUser(user.data)
              break
            }
          }
        }
      } catch (e) {
        push && push('/login')
      }
    })()
  }, [fav])

  return (
    <Card className={classes.card}>
      <IconButton className={classes.favoriteButton} size={'small'} onClick={() => setFav({ value: !fav.value, changed: true })}>
        {fav.value ? <StarRounded fontSize={'large'} className={classes.favorite}/> : <StarBorderRounded fontSize={'large'} className={classes.favorite}/>}
      </IconButton>
      <CardMedia
        className={classes.media}
        image={image}
        title={name}
      />
      <Box m={2}>
        <Typography variant={'subtitle2'} color={'textSecondary'}>№{id}</Typography>
        <Box my={0.5}>
          <Typography variant={'button'}>{name}</Typography>
        </Box>
        <Grid container direction={'row'} spacing={1}>
          {types && types.sort((a, b) => a.slot - b.slot).map(item => <Grid key={item.type.name} item><PokeType type={item.type} clickHandler={typeToFilter}/></Grid>)}
        </Grid>
      </Box>
    </Card>
  )
}

export default PokemonCard
