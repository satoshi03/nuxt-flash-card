import firebase from '~/plugins/firebase'

export const strict = false

export const state = () => ({
  cards: null,
})

export const mutations = {
  init (state) {
    state.cards = []
  },
  addCard (state, payload) {
    // add card in local
    state.cards.push(payload)
  },
  editCard (state, payload) {
    // edit card in local
    state.cards.splice(payload.index, 1, payload.card)
  },
}

export const actions = {
  init ({ commit }) {
    commit('init')
  },
  addCard ({ commit }, payload) {
    commit('addCard', payload)
  },
  editCard ({ commit }, payload) {
    commit('editCard', payload)
  }
}

export const getters = {
  cards (state) {
    return state.cards
  }
}
