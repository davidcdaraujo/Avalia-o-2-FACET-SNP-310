<template>
  <v-card border flat>
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            clearable
            hide-details
            label="Busca geral (nome, tutor, telefone, espécie, cidade...)"
            :model-value="modelValue.busca"
            prepend-inner-icon="mdi-magnify"
            @update:model-value="atualizar('busca', $event ?? '')"
          />
        </v-col>

        <v-col cols="12" md="4" sm="6">
          <v-select
            chips
            clearable
            closable-chips
            hide-details
            :items="ESPECIES"
            label="Espécie"
            :model-value="modelValue.especies"
            multiple
            @update:model-value="atualizar('especies', $event ?? [])"
          />
        </v-col>

        <v-col cols="12" md="4" sm="6">
          <v-select
            clearable
            hide-details
            :items="PORTES"
            label="Porte"
            :model-value="modelValue.porte"
            @update:model-value="atualizar('porte', $event ?? null)"
          />
        </v-col>

        <v-col cols="12" md="4" sm="12">
          <div class="text-body-small text-medium-emphasis">Vacinado</div>

          <v-btn-toggle
            color="primary"
            density="comfortable"
            divided
            mandatory
            :model-value="modelValue.vacinado"
            variant="outlined"
            @update:model-value="atualizar('vacinado', $event)"
          >
            <v-btn text="Todos" value="todos" />
            <v-btn text="Sim" value="sim" />
            <v-btn text="Não" value="nao" />
          </v-btn-toggle>
        </v-col>

        <v-col cols="6" md="3">
          <v-text-field
            hide-details
            label="Peso de (kg)"
            min="0"
            :model-value="modelValue.pesoMin"
            type="number"
            @update:model-value="atualizar('pesoMin', paraNumero($event))"
          />
        </v-col>

        <v-col cols="6" md="3">
          <v-text-field
            hide-details
            label="Peso até (kg)"
            min="0"
            :model-value="modelValue.pesoMax"
            type="number"
            @update:model-value="atualizar('pesoMax', paraNumero($event))"
          />
        </v-col>

        <v-col cols="6" md="3">
          <v-text-field
            hide-details
            label="Nascido de"
            :model-value="modelValue.dataDe"
            type="date"
            @update:model-value="atualizar('dataDe', $event)"
          />
        </v-col>

        <v-col cols="6" md="3">
          <v-text-field
            hide-details
            label="Nascido até"
            :model-value="modelValue.dataAte"
            type="date"
            @update:model-value="atualizar('dataAte', $event)"
          />
        </v-col>

        <v-col class="d-flex flex-wrap align-center ga-2" cols="12">
          <v-checkbox
            density="compact"
            hide-details
            label="Somente castrados"
            :model-value="modelValue.somenteCastrados"
            @update:model-value="atualizar('somenteCastrados', !!$event)"
          />

          <v-spacer />

          <v-btn
            color="secondary"
            prepend-icon="mdi-filter-remove"
            text="Limpar filtros"
            variant="tonal"
            @click="emit('limpar')"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { Filtros } from '@/services/filtros'
  import { ESPECIES, PORTES } from '@/types/pet'

  const props = defineProps<{
    modelValue: Filtros
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: Filtros]
    'limpar': []
  }>()

  function atualizar<K extends keyof Filtros> (campo: K, valor: Filtros[K]) {
    emit('update:modelValue', { ...props.modelValue, [campo]: valor })
  }

  function paraNumero (valor: string | number | null): number | null {
    if (valor === null || valor === '') return null
    const numero = Number(valor)
    return Number.isNaN(numero) ? null : numero
  }
</script>
