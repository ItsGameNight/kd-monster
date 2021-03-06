var themeSwitchMixin = {
  methods: {
    setThemeByIndex: function (index) {
      if (index === 0) {
        this.$store.dispatch('setUserPref', { name: 'theme', val: 'theme-light' })
      } else if (index === 1) {
        this.$store.dispatch('setUserPref', { name: 'theme', val: 'theme-dark' })
      }
    }
  }
}

export { themeSwitchMixin as default }
