import { action, observable, reaction, computed, set, get } from 'mobx'
import { POKEAPI, API } from '../_helpers/constants'
import axios from 'axios/index'
import { asyncForEachAll } from '../_helpers'

export default class UserStore {
  constructor () {
    reaction(() => ({}), async () => {
      try {
        const { data } = await axios.get(`${API}user`, { withCredentials: true })
        const user = data
        this.setUser(user)
      } catch (e) { }
    }, { fireImmediately: true })

    reaction(() => this.user, async (data) => {
      try {
        let { favoritePokemons, params: { offset, limit } } = data
        set(this.params, 'pokemonCount', favoritePokemons.length)
        favoritePokemons = favoritePokemons.slice(offset, limit + offset)
        favoritePokemons = favoritePokemons.filter((item, pos) => favoritePokemons.indexOf(item) === pos)
        let pokemonArray = await asyncForEachAll(favoritePokemons, async (item) => {
          try {
            return (await axios.get(`${POKEAPI}pokemon/${item}`)).data
          } catch (e) {}
        })
        pokemonArray = pokemonArray.map((item) => item.value)
        pokemonArray.sort((a, b) => favoritePokemons.indexOf(a.id) - favoritePokemons.indexOf(b.id))
        this.pokemonArray = pokemonArray
      } catch {}
    }, { fireImmediately: true })

    reaction(() => this.logoutComputed, async (data) => {
      try {
        this.unsetUser()
        axios.get(`${API}auth/logout`, { withCredentials: true })
      } catch {}
    })
  }

  @observable params = {
    isAuthorized: false,
    id: '',
    firstName: '',
    lastName: '',
    offset: 0,
    limit: 20,
    pokemonCount: 0
  }

  @observable logoutFlag = { flag: false }
  @observable favoritePokemons = []
  @observable pokemonArray = []

  @action setUser = (user) => {
    set(this.params, 'isAuthorized', true)
    set(this.params, 'id', user._id)
    set(this.params, 'firstName', user.firstName)
    set(this.params, 'lastName', user.lastName)
    set(this.favoritePokemons, user.pokemons)
  }

  @action unsetUser = () => {
    const params = {
      isAuthorized: false,
      id: '',
      firstName: '',
      lastName: '',
      offset: 0,
      limit: 20,
      pokemonCount: 0
    }
    set(this, 'params', params)
    set(this, 'favoritePokemons', [])
  }

  @action next = () => {
    set(this.params, 'offset', this.params.offset + this.params.limit)
  }

  @action back = () => {
    set(this.params, 'offset', Math.max(this.params.offset - this.params.limit, 0))
  }

  @action clearOffset = () => {
    set(this.params, 'offset', 0)
  }

  @action changeLimit = (limit) => {
    this.clearOffset()
    set(this.params, 'limit', limit)
  }

  @action logout = () => {
    set(this.logoutFlag, 'flag', !this.logoutFlag.flag)
  }

  @computed get logoutComputed () {
    return {
      logoutFlag: get(this.logoutFlag, 'flag')
    }
  }

  @computed get user () {
    return {
      params: {
        id: get(this.params, 'id'),
        limit: get(this.params, 'limit'),
        offset: get(this.params, 'offset')
      },
      favoritePokemons: [...this.favoritePokemons]
    }
  }
}
