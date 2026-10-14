<template>
  <v-dialog
    max-width="420"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center ga-2">
        <v-icon color="error" icon="mdi-alert-circle-outline" />
        {{ titulo }}
      </v-card-title>

      <v-card-text>{{ mensagem }}</v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text="Cancelar" variant="plain" @click="emit('update:modelValue', false)" />
        <v-btn color="error" text="Excluir" variant="flat" @click="emit('confirm')" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  defineProps<{
    modelValue: boolean
    titulo: string
    mensagem: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'confirm': []
  }>()
</script>
