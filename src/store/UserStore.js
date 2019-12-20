import { action, observable, reaction, computed, set } from 'mobx'
import { POKEAPI, API } from '../_helpers/constants'
import axios from 'axios/index'
import { asyncForEachAll } from '../_helpers'

export default class UserStore {
  constructor () {
    reaction(() => ({}), async () => {
      try {
        const { data } = await axios.get(`${API}user`, { withCredentials: true })
        this.setUser(data)
      } catch (e) { }
    }, { fireImmediately: true })

    reaction(() => this.user, async (data) => {
      try {
        let { favoritePokemons, params: { offset, limit } } = data
        this.params.pokemonCount = favoritePokemons.length
        favoritePokemons = favoritePokemons.slice(offset, limit + offset)
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
    this.params.isAuthorized = true
    this.params.id = user._id
    this.params.firstName = user.firstName
    this.params.lastName = user.lastName
    this.favoritePokemons = user.pokemons
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
    this.favoritePokemons = []
  }

  @action next = () => {
    this.params.offset = this.params.offset + this.params.limit
  }

  @action back = () => {
    this.params.offset = Math.max(this.params.offset - this.params.limit, 0)
  }

  @action clearOffset = () => {
    this.params.offset = 0
  }

  @action changeLimit = (limit) => {
    this.clearOffset()
    this.params.limit = limit
  }

  @action logout = () => {
    this.logoutFlag.flag = !this.logoutFlag.flag
  }

  @computed get logoutComputed () {
    return {
      logoutFlag: this.logoutFlag.flag
    }
  }

  @computed get user () {
    return {
      params: {
        id: this.params.id,
        limit: this.params.limit,
        offset: this.params.offset
      },
      favoritePokemons: [...this.favoritePokemons]
    }
  }
}
