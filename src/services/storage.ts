/**
 * services/storage.ts
 *
 * Fonte única de dados usada pelo CRUD (/pets) e pela consulta (/consulta).
 * Lê e grava no localStorage (JSON.stringify ao salvar / JSON.parse ao carregar).
 */

import type { Pet, PetForm } from '@/types/pet'

const CHAVE = 'petshop:pets'

const exemplos: Pet[] = [
  { id: 1, nome: 'Thor', tutor: 'Ana Souza', telefone: '(65) 99999-1111', especie: 'Cachorro', porte: 'Grande', peso: 32.5, dataNascimento: '2019-03-12', vacinado: true, castrado: true, cep: '78300-000', logradouro: 'Rua das Flores', bairro: 'Centro', cidade: 'Tangará da Serra', uf: 'MT' },
  { id: 2, nome: 'Mia', tutor: 'Carlos Lima', telefone: '(65) 98888-2222', especie: 'Gato', porte: 'Pequeno', peso: 4.2, dataNascimento: '2021-08-01', vacinado: true, castrado: false, cep: '78005-370', logradouro: 'Avenida Getúlio Vargas', bairro: 'Centro Norte', cidade: 'Cuiabá', uf: 'MT' },
  { id: 3, nome: 'Piu', tutor: 'Beatriz Rocha', telefone: '(11) 97777-3333', especie: 'Pássaro', porte: 'Pequeno', peso: 0.1, dataNascimento: '2023-01-20', vacinado: false, castrado: false, cep: '01001-000', logradouro: 'Praça da Sé', bairro: 'Sé', cidade: 'São Paulo', uf: 'SP' },
  { id: 4, nome: 'Bolinha', tutor: 'Ana Souza', telefone: '(65) 99999-1111', especie: 'Roedor', porte: 'Pequeno', peso: 0.9, dataNascimento: '2024-05-15', vacinado: false, castrado: false, cep: '78300-000', logradouro: 'Rua das Flores', bairro: 'Centro', cidade: 'Tangará da Serra', uf: 'MT' },
  { id: 5, nome: 'Rex', tutor: 'Diego Martins', telefone: '(65) 96666-4444', especie: 'Cachorro', porte: 'Médio', peso: 14, dataNascimento: '2020-11-30', vacinado: true, castrado: false, cep: '78048-000', logradouro: 'Avenida Fernando Corrêa da Costa', bairro: 'Coxipó', cidade: 'Cuiabá', uf: 'MT' },
]

export function carregarPets (): Pet[] {
  const json = localStorage.getItem(CHAVE)
  if (json === null) {
    // primeira execução: grava dados de exemplo
    salvarPets(exemplos)
    return [...exemplos]
  }
  try {
    return JSON.parse(json) as Pet[]
  } catch {
    return []
  }
}

export function salvarPets (pets: Pet[]): void {
  localStorage.setItem(CHAVE, JSON.stringify(pets))
}

/** Insere (id nulo) ou atualiza um pet e devolve a lista atualizada. */
export function salvarPet (form: PetForm): Pet[] {
  const pets = carregarPets()
  if (form.id === null) {
    const novo: Pet = { ...form, id: Date.now() }
    pets.push(novo)
  } else {
    const index = pets.findIndex(p => p.id === form.id)
    if (index === -1) {
      throw new Error('Registro não encontrado.')
    }
    pets[index] = { ...form, id: form.id }
  }
  salvarPets(pets)
  return pets
}

export function excluirPet (id: number): Pet[] {
  const pets = carregarPets().filter(p => p.id !== id)
  salvarPets(pets)
  return pets
}
