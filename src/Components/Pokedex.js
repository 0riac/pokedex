import React, { Component } from 'react'
import axios from 'axios'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Card from './Card'
import Filter from './Filter'
import { BP, POKEAPI } from '../_helpers/constants'
import { inject, observer } from 'mobx-react'
import { asyncForEachAll } from '../_helpers'
import qs from 'query-string'

@inject('routing', 'filterStore', 'userStore')
@observer
class Pokedex extends Component {
  constructor (props) {
    super(props)
    this.state = { }
  }

  async loadPokemons () {
    try {
      const { filterStore } = this.props
      const { params, pokeTypes } = filterStore
      const { offset, limit } = qs.parse(this.props.location.search)
      if (params.search) {
        const { data } = await axios.get(`${POKEAPI}pokemon/${params.search}`)
        const pokemon = data.results
        const pokemonArray = pokemon ? [pokemon] : []
        this.setState({ pokemonArray })
      } else if (pokeTypes && pokeTypes.size) {
        const pokeTypeArray = [...pokeTypes]
        const pokemonByTypeArray = await asyncForEachAll(pokeTypeArray, async (item) => {
          try {
            return (await axios.get(item.url)).data
          } catch (e) {}
        })
        const pokemonList = pokemonByTypeArray.reduce((a, b) => [...a, ...b], []).slice(offset, offset + limit)
        const pokemonArray = await asyncForEachAll(pokemonList, async (item) => {
          try {
            return (await axios.get(item.pokemon.url)).data
          } catch (e) {}
        })
        this.setState({ pokemonArray: pokemonArray.map((item) => item.value) })
      } else {
        const { data } = await axios.get(`${POKEAPI}pokemon`, { params: { offset, limit } })
        const { previous, next } = data
        const pokemonList = data.results

        this.setState({ previous, next })

        const pokemonArray = await asyncForEachAll(pokemonList, async (item) => {
          try {
            return (await axios.get(item.url)).data
          } catch (e) {
          }
        })

        this.setState({ pokemonArray: pokemonArray.map((item) => item.value) })
      }
    } catch {}
  }

  render () {
    const { filterStore, userStore, routing: { push } } = this.props
    const { addType, params, pokemonArray, next, back } = filterStore
    const { favoritePokemons, setUser } = userStore
    const { offset, limit, pokemonCount } = params

    return (
      <Container maxWidth={BP}>
        <Filter/>
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
                typeToFilter={(type) => addType(type)}
                favorite={favoritePokemons.find((id) => item.id === +id)}
                setUser={setUser}
                push={push}
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
      </Container>
    )
  }
}

export default Pokedex
