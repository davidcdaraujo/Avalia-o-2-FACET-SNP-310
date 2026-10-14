import vuetify from 'eslint-config-vuetify'

export default vuetify({
  ts: true,
}, {
  rules: {
    // v-model em componentes usa o evento 'update:modelValue'
    'vue/custom-event-name-casing': 'off',
  },
})
