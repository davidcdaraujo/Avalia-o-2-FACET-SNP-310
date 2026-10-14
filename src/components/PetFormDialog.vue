<template>
  <v-dialog
    max-width="760"
    :model-value="modelValue"
    persistent
    scrollable
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="bg-blue-darken-4">
        <v-icon icon="mdi-paw" start />
        {{ editando ? 'Editar' : 'Cadastrar' }} Pet
      </v-card-title>

      <v-card-text>
        <form @submit.prevent="enviar">
          <div class="text-title-small mb-2">Dados do pet</div>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.trim="nome"
                counter="50"
                :error-messages="errors.nome"
                label="Nome do pet *"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="especie"
                :error-messages="errors.especie"
                :items="ESPECIES"
                label="Espécie *"
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-select
                v-model="porte"
                :error-messages="errors.porte"
                :items="PORTES"
                label="Porte *"
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                v-model.number="peso"
                :error-messages="errors.peso"
                label="Peso (kg) *"
                max="150"
                min="0.01"
                step="0.1"
                type="number"
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                v-model="dataNascimento"
                :error-messages="errors.dataNascimento"
                label="Data de nascimento *"
                :max="hoje"
                type="date"
              />
            </v-col>

            <v-col cols="6">
              <v-switch
                v-model="vacinado"
                color="success"
                hide-details
                inset
                label="Vacinado"
              />
            </v-col>

            <v-col cols="6">
              <v-switch
                v-model="castrado"
                color="success"
                hide-details
                inset
                label="Castrado"
              />
            </v-col>
          </v-row>

          <div class="text-title-small mt-4 mb-2">Tutor</div>

          <v-row dense>
            <v-col cols="12" sm="7">
              <v-text-field
                v-model.trim="tutor"
                :error-messages="errors.tutor"
                label="Nome do tutor *"
              />
            </v-col>

            <v-col cols="12" sm="5">
              <v-text-field
                v-model.trim="telefone"
                :error-messages="errors.telefone"
                hint="Ex.: (65) 99999-1234"
                label="Telefone *"
              />
            </v-col>

            <v-col cols="12" sm="5">
              <v-text-field
                v-model.trim="cep"
                append-inner-icon="mdi-magnify"
                :error-messages="errors.cep"
                hint="Digite o CEP para preencher o endereço"
                label="CEP *"
                :loading="buscandoCep"
                maxlength="9"
                @blur="consultarCep"
                @click:append-inner="consultarCep"
                @keydown.enter.prevent="consultarCep"
              />
            </v-col>

            <v-col cols="12" sm="7">
              <v-text-field
                v-model.trim="logradouro"
                :error-messages="errors.logradouro"
                label="Logradouro"
              />
            </v-col>

            <v-col cols="12" sm="5">
              <v-text-field v-model.trim="bairro" label="Bairro" />
            </v-col>

            <v-col cols="8" sm="5">
              <v-text-field
                v-model.trim="cidade"
                :error-messages="errors.cidade"
                label="Cidade *"
              />
            </v-col>

            <v-col cols="4" sm="2">
              <v-text-field
                v-model.trim="uf"
                :error-messages="errors.uf"
                label="UF *"
                maxlength="2"
              />
            </v-col>
          </v-row>

          <v-alert
            v-if="erroCep"
            class="mt-2"
            closable
            density="compact"
            :text="erroCep"
            type="warning"
            variant="tonal"
            @click:close="erroCep = ''"
          />
        </form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancelar" variant="plain" @click="emit('update:modelValue', false)" />
        <v-spacer />

        <v-btn
          color="blue-darken-4"
          prepend-icon="mdi-content-save"
          text="Salvar"
          variant="flat"
          @click="enviar"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { PetForm } from '@/types/pet'
  import { useForm } from 'vee-validate'
  import { computed, ref, watch } from 'vue'
  import { buscarCep } from '@/services/viacep'
  import { ESPECIES, PORTES } from '@/types/pet'

  const props = defineProps<{
    modelValue: boolean
    pet: PetForm
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'save': [pet: PetForm]
  }>()

  const hoje = new Date().toISOString().slice(0, 10)

  const obrigatorio = (valor: unknown) => valor !== undefined && valor !== null && String(valor).trim() !== ''

  const { handleSubmit, resetForm, errors, defineField, setFieldValue, setFieldError } = useForm<PetForm>({
    validationSchema: {
      nome (valor: string) {
        if (!obrigatorio(valor)) return 'O nome do pet é obrigatório.'
        if (valor.length < 2) return 'O nome deve ter pelo menos 2 caracteres.'
        if (valor.length > 50) return 'O nome deve ter no máximo 50 caracteres.'
        return true
      },
      especie (valor: string) {
        return ESPECIES.includes(valor as never) || 'Selecione uma espécie.'
      },
      porte (valor: string) {
        return PORTES.includes(valor as never) || 'Selecione o porte.'
      },
      peso (valor: number | string) {
        if (!obrigatorio(valor)) return 'O peso é obrigatório.'
        const numero = Number(valor)
        if (Number.isNaN(numero)) return 'Informe um número válido.'
        if (numero <= 0) return 'O peso deve ser maior que 0 kg.'
        if (numero > 150) return 'O peso deve ser no máximo 150 kg.'
        return true
      },
      dataNascimento (valor: string) {
        if (!obrigatorio(valor)) return 'A data de nascimento é obrigatória.'
        if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return 'Data inválida.'
        if (valor > hoje) return 'A data de nascimento não pode estar no futuro.'
        if (valor < '1980-01-01') return 'A data deve ser posterior a 01/01/1980.'
        return true
      },
      tutor (valor: string) {
        if (!obrigatorio(valor)) return 'O nome do tutor é obrigatório.'
        if (valor.length < 3) return 'O nome do tutor deve ter pelo menos 3 caracteres.'
        return true
      },
      telefone (valor: string) {
        if (!obrigatorio(valor)) return 'O telefone é obrigatório.'
        if (!/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/.test(valor)) return 'Telefone inválido. Use o formato (65) 99999-1234.'
        return true
      },
      cep (valor: string) {
        if (!obrigatorio(valor)) return 'O CEP é obrigatório.'
        if (!/^\d{5}-?\d{3}$/.test(valor)) return 'CEP inválido. Use o formato 00000-000.'
        return true
      },
      cidade (valor: string) {
        return obrigatorio(valor) || 'A cidade é obrigatória (busque pelo CEP).'
      },
      uf (valor: string) {
        if (!obrigatorio(valor)) return 'UF obrigatória.'
        if (!/^[A-Z]{2}$/i.test(valor)) return 'UF inválida.'
        return true
      },
    },
  })

  const [nome] = defineField('nome')
  const [especie] = defineField('especie')
  const [porte] = defineField('porte')
  const [peso] = defineField('peso')
  const [dataNascimento] = defineField('dataNascimento')
  const [vacinado] = defineField('vacinado')
  const [castrado] = defineField('castrado')
  const [tutor] = defineField('tutor')
  const [telefone] = defineField('telefone')
  const [cep] = defineField('cep')
  const [logradouro] = defineField('logradouro')
  const [bairro] = defineField('bairro')
  const [cidade] = defineField('cidade')
  const [uf] = defineField('uf')

  const editando = computed(() => props.pet.id !== null)

  // sempre que o diálogo abrir, carrega os dados do pet recebido via prop
  watch(() => props.modelValue, aberto => {
    if (aberto) {
      erroCep.value = ''
      ultimoCepBuscado = props.pet.cep.replace(/\D/g, '')
      resetForm({ values: { ...props.pet } })
    }
  })

  // ---- integração com ViaCEP (Axios) ----
  const buscandoCep = ref(false)
  const erroCep = ref('')
  let ultimoCepBuscado = ''

  async function consultarCep () {
    const valor = (cep.value ?? '').trim()
    const numeros = valor.replace(/\D/g, '')
    if (numeros === '' || numeros === ultimoCepBuscado) return

    erroCep.value = ''
    buscandoCep.value = true
    try {
      const endereco = await buscarCep(valor)
      ultimoCepBuscado = numeros
      setFieldValue('cep', `${numeros.slice(0, 5)}-${numeros.slice(5)}`)
      setFieldValue('logradouro', endereco.logradouro)
      setFieldValue('bairro', endereco.bairro)
      setFieldValue('cidade', endereco.cidade)
      setFieldValue('uf', endereco.uf)
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao consultar o CEP.'
      erroCep.value = `${mensagem} Você pode preencher o endereço manualmente.`
      setFieldError('cep', mensagem)
    } finally {
      buscandoCep.value = false
    }
  }

  const enviar = handleSubmit(valores => {
    emit('save', {
      ...valores,
      id: props.pet.id,
      peso: Number(valores.peso),
      uf: valores.uf.toUpperCase(),
    })
  })
</script>
