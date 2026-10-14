/**
 * services/format.ts
 *
 * Funções de formatação usadas nas tabelas.
 */

export function formatarData (iso: string): string {
  if (!iso) {
    return ''
  }
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

export function formatarPeso (peso: number): string {
  return `${peso.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg`
}

export function simNao (valor: boolean): string {
  return valor ? 'Sim' : 'Não'
}
