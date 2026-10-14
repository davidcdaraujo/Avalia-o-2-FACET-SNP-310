<template>
  <div class="d-flex flex-column ga-6">
    <div class="text-center py-6">
      <v-icon color="blue-darken-4" icon="mdi-paw" size="64" />
      <h1 class="text-headline-large font-weight-bold mt-2">Pet Shop</h1>

      <p class="text-body-large text-medium-emphasis">
        Sistema de cadastro e consulta de pets e seus tutores.
      </p>
    </div>

    <v-row>
      <v-col cols="12" sm="4">
        <v-card class="h-100" variant="tonal">
          <v-card-item prepend-icon="mdi-counter" subtitle="cadastrados" :title="`${pets.length} pets`" />
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="h-100" variant="tonal">
          <v-card-item prepend-icon="mdi-needle" subtitle="vacinados" :title="`${vacinados} pets`" />
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="h-100" variant="tonal">
          <v-card-item prepend-icon="mdi-account-group" subtitle="tutores diferentes" :title="`${tutores}`" />
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card
          append-icon="mdi-arrow-right"
          border
          class="h-100"
          prepend-icon="mdi-pencil-box-multiple"
          subtitle="Cadastrar, editar e excluir pets"
          title="Gerenciar Pets"
          to="/pets"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-card
          append-icon="mdi-arrow-right"
          border
          class="h-100"
          prepend-icon="mdi-text-box-search-outline"
          subtitle="Pesquisar e filtrar todos os pets"
          title="Consulta"
          to="/consulta"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import type { Pet } from '@/types/pet'
  import { computed, onMounted, ref } from 'vue'
  import { carregarPets } from '@/services/storage'

  const pets = ref<Pet[]>([])
  const vacinados = computed(() => pets.value.filter(p => p.vacinado).length)
  const tutores = computed(() => new Set(pets.value.map(p => p.tutor.toLowerCase())).size)

  onMounted(() => {
    pets.value = carregarPets()
  })
</script>
