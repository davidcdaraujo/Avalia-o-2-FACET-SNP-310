<template>
  <v-app>
    <AppMenu v-model="menuAberto" :itens="itensMenu" />

    <v-app-bar color="blue-darken-4">
      <v-app-bar-nav-icon @click="menuAberto = !menuAberto" />
      <v-app-bar-title>Pet Shop</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import type { ItemMenu } from '@/components/AppMenu.vue'
  import { ref } from 'vue'
  import AppMenu from '@/components/AppMenu.vue'

  // null: o v-navigation-drawer decide (aberto em telas grandes, fechado em telas pequenas)
  const menuAberto = ref<boolean | null>(null)

  const itensMenu: ItemMenu[] = [
    { title: 'Início', icon: 'mdi-home', to: '/' },
    { title: 'Gerenciar Pets', icon: 'mdi-pencil-box-multiple', to: '/pets' },
    { title: 'Consulta', icon: 'mdi-text-box-search-outline', to: '/consulta' },
  ]
</script>
