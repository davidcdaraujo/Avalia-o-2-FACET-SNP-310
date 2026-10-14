/**
 * services/filtros.ts
 *
 * Estado dos filtros da página de consulta e a função que aplica todos eles em conjunto.
 */

import type { Especie, Pet, Porte } from '@/types/pet'

export interface Filtros {
  busca: string
  especies: Especie[]
  porte: Porte | null
  vacinado: 'todos' | 'sim' | 'nao'
  pesoMin: number | null
  pesoMax: number | null
  dataDe: string
  dataAte: string
  somenteCastrados: boolean
}

export function filtrosVazios (): Filtros {
  return {
    busca: '',
    especies: [],
    porte: null,
    vacinado: 'todos',
    pesoMin: null,
    pesoMax: null,
    dataDe: '',
    dataAte: '',
    somenteCastrados: false,
  }
}

/** Remove acentos e deixa minúsculo para comparar sem diferenciar maiúsculas/minúsculas. */
function normalizar (texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

export function aplicarFiltros (pets: Pet[], f: Filtros): Pet[] {
  const termo = normalizar(f.busca.trim())

  return pets.filter(pet => {
    if (termo) {
      const campos = [pet.nome, pet.tutor, pet.telefone, pet.especie, pet.porte, pet.cidade, pet.uf, pet.bairro, pet.logradouro, pet.cep]
      if (!campos.some(campo => normalizar(campo ?? '').includes(termo))) {
        return false
      }
    }
    if (f.especies.length > 0 && !f.especies.includes(pet.especie)) {
      return false
    }
    if (f.porte && pet.porte !== f.porte) {
      return false
    }
    if (f.vacinado === 'sim' && !pet.vacinado) {
      return false
    }
    if (f.vacinado === 'nao' && pet.vacinado) {
      return false
    }
    if (f.pesoMin !== null && pet.peso < f.pesoMin) {
      return false
    }
    if (f.pesoMax !== null && pet.peso > f.pesoMax) {
      return false
    }
    if (f.dataDe && pet.dataNascimento < f.dataDe) {
      return false
    }
    if (f.dataAte && pet.dataNascimento > f.dataAte) {
      return false
    }
    if (f.somenteCastrados && !pet.castrado) {
      return false
    }
    return true
  })
}
