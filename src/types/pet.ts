/**
 * types/pet.ts
 *
 * Entidade principal do sistema: Pet cadastrado no Pet Shop.
 */

export type Especie = 'Cachorro' | 'Gato' | 'Pássaro' | 'Roedor' | 'Réptil' | 'Peixe'

export const ESPECIES: Especie[] = ['Cachorro', 'Gato', 'Pássaro', 'Roedor', 'Réptil', 'Peixe']

export const PORTES = ['Pequeno', 'Médio', 'Grande'] as const
export type Porte = typeof PORTES[number]

export interface Pet {
  id: number
  nome: string // texto
  tutor: string // texto
  telefone: string // texto (formato validado)
  especie: Especie // seleção
  porte: Porte // seleção
  peso: number // número (kg)
  dataNascimento: string // data (yyyy-mm-dd)
  vacinado: boolean // booleano
  castrado: boolean // booleano
  cep: string // preenchido com ViaCEP
  logradouro: string
  bairro: string
  cidade: string
  uf: string
}

export type PetForm = Omit<Pet, 'id'> & { id: number | null }

export function novoPet (): PetForm {
  return {
    id: null,
    nome: '',
    tutor: '',
    telefone: '',
    especie: 'Cachorro',
    porte: 'Pequeno',
    peso: 0,
    dataNascimento: '',
    vacinado: false,
    castrado: false,
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    uf: '',
  }
}
