/**
 * services/viacep.ts
 *
 * Consulta de endereço pelo CEP usando Axios + API pública ViaCEP.
 */

import axios from 'axios'

export interface Endereco {
  logradouro: string
  bairro: string
  cidade: string
  uf: string
}

interface RespostaViaCep {
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean | string
}

export async function buscarCep (cep: string): Promise<Endereco> {
  const numeros = cep.replace(/\D/g, '')
  if (numeros.length !== 8) {
    throw new Error('CEP inválido: informe 8 dígitos.')
  }

  let dados: RespostaViaCep
  try {
    const resposta = await axios.get<RespostaViaCep>(`https://viacep.com.br/ws/${numeros}/json/`, { timeout: 8000 })
    dados = resposta.data
  } catch {
    throw new Error('Falha de rede ao consultar o CEP. Tente novamente.')
  }

  if (dados.erro) {
    throw new Error('CEP não encontrado.')
  }

  return {
    logradouro: dados.logradouro,
    bairro: dados.bairro,
    cidade: dados.localidade,
    uf: dados.uf,
  }
}
