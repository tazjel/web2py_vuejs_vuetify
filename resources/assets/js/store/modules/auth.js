import axios from 'axios'
import Cookies from 'js-cookie'
import * as types from '../mutation-types'

// state
export const state = {
  user: null,
  token: Cookies.get('token_' + window.config.appName),
}

// mutations
export const mutations = {
  [types.SAVE_TOKEN](state, {
    token,
    remember
  }) {
    state.token = token
    Cookies.set('token_' + window.config.appName, token, {
      expires: remember ? 365 : null
    })
  },

  [types.FETCH_USER_SUCCESS](state, {
    user
  }) {
    state.user = user
  },

  [types.FETCH_USER_FAILURE](state) {
    state.token = null
    Cookies.remove('token_' + window.config.appName)
  },

  [types.LOGOUT](state) {
    state.user = null
    state.token = null

    Cookies.remove('token_' + window.config.appName)
    Cookies.remove('session_id_' + window.config.appName)
  },

  [types.UPDATE_USER](state, {
    user
  }) {
    state.user = user
  }
}

// actions
export const actions = {
  saveToken({
    commit,
    dispatch
  }, payload) {
    commit(types.SAVE_TOKEN, payload)
  },

  async fetchUser({
    commit
  }) {
    try {
      const {
        data
      } = await axios.get('/' + window.config.appName + '/api/user')
      commit(types.FETCH_USER_SUCCESS, {
        user: data
      })
    } catch (e) {
      commit(types.FETCH_USER_FAILURE)
    }
  },

  async updateUser({
    commit
  }, payload) {
    commit(types.UPDATE_USER, payload)
  },

  async logout({
    commit
  }) {
    try {
      await axios.get('/' + window.config.appName + '/api/logout')
      this.$router.push({ name: 'login' })
    } catch (e) {}

    commit(types.LOGOUT)
  }

}

// getters
export const getters = {
  authUser: state => state.user,
  authToken: state => state.token,
  authCheck: state => state.user !== null
}
