<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-list-item
      class="py-4"
      prepend-icon="mdi-paw"
      subtitle="Avaliação 2 – FMDS"
      title="Pet Shop"
    />

    <v-divider />

    <v-list density="comfortable" nav>
      <v-list-item
        v-for="item in itens"
        :key="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
  export interface ItemMenu {
    title: string
    icon: string
    to: string
  }

  defineProps<{
    modelValue: boolean | null
    itens: ItemMenu[]
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
  }>()
</script>
