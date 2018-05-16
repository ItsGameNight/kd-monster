import Vue from 'vue'
import Vuex from 'vuex'
import goodnessFunction from '../../db/goodness.js'

Vue.use(Vuex)

// helper for getters
function countSurvivorsInSmtWPropVal (survs, smtID, prop, val) {
  var survsInSmt = survs.filter((s) => { return s.settlementID === smtID })
  return survsInSmt.filter((s) => { return s[prop] === val }).length
}

export default new Vuex.Store({
  state: {
    survivors: [],
    settlements: [],
    snapshots: [],
    currentSmt: null,
    currentSnap: null
  },
  getters: {
    survivorsInSettlement: (state) => {
      return state.survivors.filter((s) => { return s.settlementID === state.currentSmt })
    },
    survivorsInSettlementGScores: (state) => {
      var survs = state.survivors.filter((s) => { return s.settlementID === state.currentSmt })
      return survs.map((s) => { return goodnessFunction(s) })
    },
    currentSettlement: (state) => {
      var idx = state.settlements.findIndex((s) => { return s._id === state.currentSmt })
      return state.settlements[idx]
    },
    numberAliveInSettlement: (state) => {
      return countSurvivorsInSmtWPropVal(state.survivors, state.currentSmt, 'alive', true)
    },
    settlementDeathCount: (state) => {
      return countSurvivorsInSmtWPropVal(state.survivors, state.currentSmt, 'alive', false)
    },
    settlementMaleCount: (state) => {
      return countSurvivorsInSmtWPropVal(state.survivors, state.currentSmt, 'sex', 'm')
    },
    settlementFemaleCount: (state) => {
      return countSurvivorsInSmtWPropVal(state.survivors, state.currentSmt, 'sex', 'f')
    },
    snapshotsForCurrentSettlement: (state) => {
      return state.snapshots.filter((s) => { return s.settlement._id === state.currentSmt })
    }
  },
  mutations: {
    SET_SURVIVORS (state, newObj) {
      state.survivors = newObj
    },
    SET_SETTLEMENTS (state, newObj) {
      state.settlements = newObj
    },
    SET_SNAPSHOTS (state, newObj) {
      state.snapshots = newObj
    },
    SET_CURRENTSMT (state, id) {
      state.currentSmt = id
    },
    SET_CURRENTSNAP (state, id) {
      state.currentSnap = id
    },
    // Needs Vue.set --> https://vuejs.org/v2/guide/list.html#Caveats
    SET_SETTLEMENT_BY_ID (state, payload) {
      var idx = state.settlements.findIndex((s) => { return s._id === payload.id })
      Vue.set(state.settlements, idx, payload.newObj)
    },
    SET_SURVIVOR_BY_ID (state, payload) {
      var idx = state.survivors.findIndex((s) => { return s._id === payload.id })
      Vue.set(state.survivors, idx, payload.newObj)
    }
  },
  actions: {
    setCurrentSmt ({ commit }, id) {
      commit('SET_CURRENTSMT', id)
    },

    loadSettlements ({ commit }) {
      this.$settlements.getAll((smts) => {
        commit('SET_SETTLEMENTS', smts)
      })
    },

    loadSurvivors ({ commit }) {
      this.$survivors.getAll((survs) => {
        commit('SET_SURVIVORS', survs)
      })
    },

    loadSnapshots ({ commit }) {
      this.$snapshots.getAll((snaps) => {
        commit('SET_SNAPSHOTS', snaps)
      })
    },

    updateSettlement ({ commit }, payload) {
      var id = payload.id
      var update = payload.update
      // update the smt in db
      this.$settlements.updateOne(id, update, () => {
        // get the whole new object
        this.$settlements.getMatching({ _id: id }, (s) => {
          // update store
          commit('SET_SETTLEMENT_BY_ID', { id: s[0]._id, newObj: s[0] })
        })
      })
    },

    createSettlement ({ commit }) {
      this.$settlements.createNew(() => {
        this.$settlements.getAll((smts) => {
          commit('SET_SETTLEMENTS', smts)
        })
      })
    },

    deleteSettlement ({ commit }, id) {
      this.$settlements.remove(id, () => {
        this.$settlements.getAll((smts) => {
          commit('SET_SETTLEMENTS', smts)
          commit('SET_CURRENTSMT', null)
        })
      })
    },

    dropAllSurvivors ({ commit }) {
      this.$survivors.dropAll(() => {
        this.$survivors.getAll((survs) => {
          commit('SET_SURVIVORS', survs)
        })
      })
    },

    addNewSurvivor ({ commit }, smtID) {
      console.log(smtID)
      this.$survivors.addBase(smtID, { name: 'Test' }, () => {
        this.$survivors.getAll((survs) => {
          commit('SET_SURVIVORS', survs)
        })
      })
    },

    updateSurvivor ({ commit }, payload) {
      var id = payload.id
      var update = payload.update
      this.$survivors.updateOne(id, update, () => {
        this.$survivors.getMatching({ _id: id }, (s) => {
          commit('SET_SURVIVOR_BY_ID', { id: s[0]._id, newObj: s[0] })
        })
      })
    },

    createSnapshot ({ commit }, smtID) {
      this.$snapshots.createNew(smtID, () => {
        this.$snapshots.getAll((snaps) => {
          commit('SET_SNAPSHOTS', snaps)
        })
      })
    },

    setCurrentSnap ({ commit }, id) {
      commit('SET_CURRENTSNAP', id)
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
