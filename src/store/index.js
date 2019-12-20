import FilterStore from './FilterStore'
import UserStore from './UserStore'

class MainStore {
  constructor () {
    this.filterStore = new FilterStore()
    this.userStore = new UserStore()
  }
}

const mainStore = new MainStore()
const filterStore = mainStore.filterStore
const userStore = mainStore.userStore

export default mainStore

export { filterStore, userStore }
