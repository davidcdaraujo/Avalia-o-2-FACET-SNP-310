<template>
  <div class="d-flex flex-column ga-4">
    <div>
      <h1 class="text-headline-medium">
        <v-icon icon="mdi-text-box-search-outline" start />
        Consulta de Pets
      </h1>

      <p class="text-body-medium text-medium-emphasis">
        Visualize todos os pets cadastrados e combine os filtros abaixo.
      </p>
    </div>

    <PetFilters v-model="filtros" @limpar="limparFiltros" />

    <div class="d-flex align-center ga-2">
      <v-chip color="primary" prepend-icon="mdi-counter" variant="tonal">
        {{ resultados.length }} {{ resultados.length === 1 ? 'pet encontrado' : 'pets encontrados' }}
        de {{ pets.length }}
      </v-chip>
    </div>

    <v-sheet border rounded>
      <v-data-table
        :headers="headers"
        :items="resultados"
        items-per-page-text="Itens por página"
        :mobile="smAndDown"
      >
        <template #item.peso="{ item }">{{ formatarPeso(item.peso) }}</template>
        <template #item.dataNascimento="{ item }">{{ formatarData(item.dataNascimento) }}</template>

        <template #item.vacinado="{ item }">
          <v-chip :color="item.vacinado ? 'success' : 'grey'" size="small" :text="simNao(item.vacinado)" />
        </template>

        <template #item.castrado="{ item }">
          <v-chip :color="item.castrado ? 'success' : 'grey'" size="small" :text="simNao(item.castrado)" />
        </template>

        <template #item.endereco="{ item }">
          {{ [item.logradouro, item.bairro].filter(Boolean).join(', ') }}
          <div class="text-body-small text-medium-emphasis">{{ item.cidade }}/{{ item.uf }} – CEP {{ item.cep }}</div>
        </template>

        <template #no-data>
          <div class="py-8 text-center">
            <v-icon class="mb-2" icon="mdi-emoticon-sad-outline" size="48" />

            <div v-if="pets.length === 0" class="text-body-large">
              Nenhum pet cadastrado ainda. Cadastre o primeiro em
              <router-link to="/pets">Gerenciar Pets</router-link>.
            </div>

            <div v-else class="text-body-large">
              Nenhum pet atende aos filtros selecionados.
              <div>
                <v-btn class="mt-2" text="Limpar filtros" variant="text" @click="limparFiltros" />
              </div>
            </div>
          </div>
        </template>
      </v-data-table>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
  import type { Filtros } from '@/services/filtros'
  import type { Pet } from '@/types/pet'
  import { computed, onMounted, ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import PetFilters from '@/components/PetFilters.vue'
  import { aplicarFiltros, filtrosVazios } from '@/services/filtros'
  import { formatarData, formatarPeso, simNao } from '@/services/format'
  import { carregarPets } from '@/services/storage'

  const { smAndDown } = useDisplay()

  const pets = ref<Pet[]>([])
  const filtros = ref<Filtros>(filtrosVazios())

  // todos os filtros aplicados em conjunto, de forma reativa
  const resultados = computed(() => aplicarFiltros(pets.value, filtros.value))

  const headers = [
    { title: 'Nome', key: 'nome' },
    { title: 'Espécie', key: 'especie' },
    { title: 'Porte', key: 'porte' },
    { title: 'Peso', key: 'peso', align: 'end' as const },
    { title: 'Nascimento', key: 'dataNascimento' },
    { title: 'Vacinado', key: 'vacinado' },
    { title: 'Castrado', key: 'castrado' },
    { title: 'Tutor', key: 'tutor' },
    { title: 'Telefone', key: 'telefone', sortable: false },
    { title: 'Endereço', key: 'endereco', sortable: false },
  ]

  onMounted(() => {
    pets.value = carregarPets()
  })

  function limparFiltros () {
    filtros.value = filtrosVazios()
  }
</script>
