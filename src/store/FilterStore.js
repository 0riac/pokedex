import { action, observable, reaction, computed, set, get } from 'mobx'
import { POKEAPI } from '../_helpers/constants'
import axios from 'axios/index'
import { asyncForEachAll } from '../_helpers'

export default class FilterStore {
  constructor () {
    reaction(() => this.data, async (data) => {
      try {
        const { params, pokeTypes } = data
        const { offset, limit } = params
        if (params.search) {
          try {
            const { data } = await axios.get(`${POKEAPI}pokemon/${params.search}`)
            const pokemon = data
            const pokemonArray = pokemon ? [pokemon] : []
            set(this.params, 'pokemonCount', pokemonArray.length)
            this.pokemonArray = pokemonArray
          } catch (e) {
            const pokemonArray = []
            set(this.params, 'pokemonCount', pokemonArray.length)
            this.pokemonArray = pokemonArray
          }
        } else if (pokeTypes && pokeTypes.length) {
          const pokeTypeArray = (await axios.get(`${POKEAPI}type/`)).data.results
            .filter((item) => pokeTypes.find((type) => type === item.name))
          pokeTypeArray.sort((a, b) => pokeTypes.indexOf(a.name) - pokeTypes.indexOf(b.name))

          let pokemonByTypeArray = await asyncForEachAll(pokeTypeArray, async (item) => {
            try {
              return (await axios.get(item.url)).data
            } catch (e) {}
          })
          pokemonByTypeArray = pokemonByTypeArray.map((item) => item.value.pokemon)
          let pokemonList = pokemonByTypeArray.reduce((a, b) => [...a, ...b], [])
          set(this.params, 'pokemonCount', pokemonList.length)
          pokemonList = pokemonList.slice(offset, offset + limit)
          const pokemonArray = await asyncForEachAll(pokemonList, async (item) => {
            try {
              return (await axios.get(item.pokemon.url)).data
            } catch (e) {}
          })
          this.pokemonArray = pokemonArray.map((item) => item.value).sort((a, b) => +a.id - +b.id)
        } else {
          const { data } = await axios.get(`${POKEAPI}pokemon`, { params: { offset, limit } })
          set(this.params, 'pokemonCount', data.count)
          const pokemonList = data.results

          const pokemonArray = await asyncForEachAll(pokemonList, async (item) => {
            try {
              return (await axios.get(item.url)).data
            } catch (e) {}
          })

          this.pokemonArray = pokemonArray.map((item) => item.value).sort((a, b) => +a.id - +b.id)
        }
      } catch (e) {
        console.log(e)
      }
    }, { fireImmediately: true })
  }

  @observable params = {
    search: '',
    limit: 20,
    offset: 0,
    pokemonCount: 0
  }

  @observable pokemonArray = []

  @observable pokeTypes = new Set([]);

  @action addType = (type) => {
    this.clearSearch()
    this.pokeTypes.add(type)
  }

  @action removeType = (type) => {
    this.pokeTypes.delete(type)
  }

  @action clearOffset = () => {
    set(this.params, 'offset', 0)
  }

  @action clearSearch = () => {
    set(this.params, 'search', '')
  }

  @action changeSearch = (search) => {
    this.clearOffset()
    set(this.params, 'search', search)
  }

  @action changeLimit = (limit) => {
    this.clearOffset()
    set(this.params, 'limit', limit)
  }

  @action next = () => {
    set(this.params, 'offset', this.params.offset + this.params.limit)
  }

  @action back = () => {
    set(this.params, 'offset', Math.max(this.params.offset - this.params.limit, 0))
  }

  @computed get data () {
    return {
      params: {
        limit: get(this.params, 'limit'),
        offset: get(this.params, 'offset'),
        search: get(this.params, 'search')
      },
      pokeTypes: [...this.pokeTypes]

    }
  }
}
