# Pet Shop – Cadastro e Consulta de Pets

Avaliação 2 – FACET-SNP-310 – Frameworks Modernos para Desenvolvimento de Sistemas (2026.2)

## Integrantes

- David Costa de Araújo e Lana Emanuele de S. Moraes – @davidcdaraujo-github

## Tema

**Pet Shop.** O sistema permite cadastrar os pets atendidos pelo pet shop, junto com os dados do tutor
(responsável) e seu endereço, e consultar todos os pets cadastrados com filtros combinados.

Entidade principal: **Pet**

| Campo            | Tipo                  | Componente               |
|------------------|-----------------------|--------------------------|
| `nome`           | texto                 | `v-text-field`           |
| `especie`        | seleção               | `v-select`               |
| `porte`          | seleção               | `v-select`               |
| `peso`           | número (kg)           | `v-text-field type=number` |
| `dataNascimento` | data                  | `v-text-field type=date` |
| `vacinado`       | booleano              | `v-switch`               |
| `castrado`       | booleano              | `v-switch`               |
| `tutor`          | texto                 | `v-text-field`           |
| `telefone`       | texto (formato)       | `v-text-field`           |
| `cep`, `logradouro`, `bairro`, `cidade`, `uf` | texto (preenchidos pela API ViaCEP) | `v-text-field` |

## Funcionalidades

- **Página inicial** (`/`) com resumo (total de pets, vacinados, tutores) e atalhos.
- **CRUD de pets** (`/pets`)
  - Listagem em `v-data-table` com ações de editar e excluir por linha;
  - Cadastro e edição em `v-dialog` com validação via **vee-validate** (obrigatoriedade, formato de
    telefone/CEP/UF, peso entre 0 e 150 kg, data de nascimento não futura) e mensagens em português;
  - Exclusão com diálogo de confirmação;
  - `v-snackbar` de sucesso/erro após salvar, editar e excluir.
- **Página de consulta com filtros** (`/consulta`)
  - Exibe todos os pets com todos os campos formatados (datas `dd/mm/aaaa`, peso em kg, Sim/Não);
  - Busca textual geral (nome, tutor, telefone, espécie, porte, endereço), sem diferenciar
    maiúsculas/minúsculas nem acentos;
  - Filtros por campo: **espécie** (seleção múltipla), **porte** (seleção), **vacinado** (Todos/Sim/Não),
    **somente castrados** (booleano), **intervalo de peso** (de/até) e **intervalo de data de nascimento** (de/até);
  - Todos os filtros funcionam combinados (via `computed`) e há botão **Limpar filtros**;
  - Contador de resultados e mensagem amigável quando nenhum pet é encontrado.
- **Dados compartilhados e persistentes**: CRUD e consulta usam o mesmo serviço
  (`src/services/storage.ts`), que grava no `localStorage` com `JSON.stringify` e lê com `JSON.parse`.
  Na primeira execução são gravados 5 pets de exemplo.
- **API consumida: ViaCEP** com **Axios** (`src/services/viacep.ts`). Ao informar o CEP do tutor
  (Enter, sair do campo ou clicar na lupa) o endereço é preenchido automaticamente, com indicador
  `:loading` e tratamento de erros (CEP inválido, CEP inexistente, falha de rede).
- **Menu lateral** (`v-navigation-drawer`) com rotas para Início, Gerenciar Pets e Consulta;
  layout responsivo (tabelas viram cartões em telas pequenas).

## Estrutura

```
src/
├── App.vue                    # layout: app-bar + menu lateral + router-view
├── components/
│   ├── AppMenu.vue            # menu lateral (props: modelValue, itens / emits: update:modelValue)
│   ├── ConfirmDialog.vue      # diálogo de confirmação (props: titulo, mensagem / emits: confirm)
│   ├── PetFilters.vue         # barra de filtros (v-model: Filtros / emits: limpar)
│   └── PetFormDialog.vue      # formulário com validação + ViaCEP (props: pet / emits: save)
├── pages/                     # rotas automáticas (File Router)
│   ├── index.vue              # /
│   ├── pets.vue               # /pets      (CRUD)
│   └── consulta.vue           # /consulta  (consulta com filtros)
├── services/
│   ├── storage.ts             # leitura/gravação no localStorage
│   ├── viacep.ts              # consulta de CEP com Axios
│   ├── filtros.ts             # estado e aplicação dos filtros
│   └── format.ts              # formatação de datas, peso e booleanos
└── types/pet.ts               # tipo da entidade Pet
```

## Tecnologias

Vue 3 + Vite, TypeScript, Vuetify 4, Vue Router (rotas automáticas), vee-validate, Axios.

## Como executar

```bash
npm install
npm run dev
```

A aplicação abre em http://localhost:3000.

Outros scripts: `npm run build` (type-check + build de produção) e `npm run lint`.
