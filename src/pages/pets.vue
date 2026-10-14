<template>
  <v-sheet border rounded>
    <v-data-table
      :headers="headers"
      :items="pets"
      items-per-page-text="Itens por página"
      :mobile="smAndDown"
      no-data-text="Nenhum pet cadastrado."
      :search="busca"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon color="medium-emphasis" icon="mdi-paw" size="x-small" start />
            Gerenciar Pets
          </v-toolbar-title>

          <v-btn
            border
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Adicionar"
            @click="adicionar"
          />
        </v-toolbar>

        <div class="px-4 pb-2">
          <v-text-field
            v-model="busca"
            clearable
            density="compact"
            hide-details
            label="Pesquisar na tabela"
            prepend-inner-icon="mdi-magnify"
          />
        </div>
      </template>

      <template #item.peso="{ item }">{{ formatarPeso(item.peso) }}</template>
      <template #item.dataNascimento="{ item }">{{ formatarData(item.dataNascimento) }}</template>

      <template #item.vacinado="{ item }">
        <v-chip :color="item.vacinado ? 'success' : 'grey'" size="small" :text="simNao(item.vacinado)" />
      </template>

      <template #item.cidade="{ item }">{{ item.cidade }}/{{ item.uf }}</template>

      <template #item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-btn
            aria-label="Editar"
            color="primary"
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click="editar(item.id)"
          />

          <v-btn
            aria-label="Excluir"
            color="error"
            icon="mdi-delete"
            size="small"
            variant="text"
            @click="pedirExclusao(item.id)"
          />
        </div>
      </template>
    </v-data-table>
  </v-sheet>

  <PetFormDialog v-model="dialogo" :pet="petEmEdicao" @save="salvar" />

  <ConfirmDialog
    v-model="dialogoExcluir"
    :mensagem="`Deseja realmente excluir o pet &quot;${petParaExcluir?.nome ?? ''}&quot;? Esta ação não pode ser desfeita.`"
    titulo="Confirmar exclusão"
    @confirm="confirmarExclusao"
  />

  <v-snackbar v-model="snackbar.aberto" :color="snackbar.cor" location="bottom right" timeout="3000">
    {{ snackbar.texto }}
  </v-snackbar>
</template>

<script setup lang="ts">
  import type { Pet, PetForm } from '@/types/pet'
  import { computed, onMounted, reactive, ref } from 'vue'
  import { useDisplay } from 'vuetify'
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import PetFormDialog from '@/components/PetFormDialog.vue'
  import { formatarData, formatarPeso, simNao } from '@/services/format'
  import { carregarPets, excluirPet, salvarPet } from '@/services/storage'
  import { novoPet } from '@/types/pet'

  const { smAndDown } = useDisplay()

  const pets = ref<Pet[]>([])
  const busca = ref('')
  const dialogo = ref(false)
  const petEmEdicao = ref<PetForm>(novoPet())

  const dialogoExcluir = ref(false)
  const idParaExcluir = ref<number | null>(null)
  const petParaExcluir = computed(() => pets.value.find(p => p.id === idParaExcluir.value))

  const snackbar = reactive({ aberto: false, texto: '', cor: 'success' })

  const headers = [
    { title: 'Nome', key: 'nome' },
    { title: 'Espécie', key: 'especie' },
    { title: 'Porte', key: 'porte' },
    { title: 'Peso', key: 'peso', align: 'end' as const },
    { title: 'Nascimento', key: 'dataNascimento' },
    { title: 'Vacinado', key: 'vacinado' },
    { title: 'Tutor', key: 'tutor' },
    { title: 'Cidade', key: 'cidade' },
    { title: 'Ações', key: 'actions', align: 'end' as const, sortable: false },
  ]

  onMounted(() => {
    pets.value = carregarPets()
  })

  function avisar (texto: string, cor = 'success') {
    snackbar.texto = texto
    snackbar.cor = cor
    snackbar.aberto = true
  }

  function adicionar () {
    petEmEdicao.value = novoPet()
    dialogo.value = true
  }

  function editar (id: number) {
    const encontrado = pets.value.find(p => p.id === id)
    if (!encontrado) {
      avisar('Pet não encontrado.', 'error')
      return
    }
    petEmEdicao.value = { ...encontrado }
    dialogo.value = true
  }

  function salvar (pet: PetForm) {
    const editando = pet.id !== null
    try {
      pets.value = salvarPet(pet)
      dialogo.value = false
      avisar(editando ? `Pet "${pet.nome}" atualizado com sucesso!` : `Pet "${pet.nome}" cadastrado com sucesso!`)
    } catch (error) {
      avisar(error instanceof Error ? `Erro ao salvar: ${error.message}` : 'Erro ao salvar.', 'error')
    }
  }

  function pedirExclusao (id: number) {
    idParaExcluir.value = id
    dialogoExcluir.value = true
  }

  function confirmarExclusao () {
    if (idParaExcluir.value === null) return
    const nome = petParaExcluir.value?.nome ?? ''
    try {
      pets.value = excluirPet(idParaExcluir.value)
      avisar(`Pet "${nome}" excluído com sucesso!`)
    } catch {
      avisar('Erro ao excluir o pet.', 'error')
    } finally {
      dialogoExcluir.value = false
      idParaExcluir.value = null
    }
  }
</script>
