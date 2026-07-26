# Refatoração da Arquitetura — Portal de Jogos Educativos

## Contexto

Este projeto foi iniciado como um jogo de caça-palavras utilizando **React + Vite + TypeScript**.

O objetivo agora é transformar a aplicação em um **portal de jogos educativos**, onde o caça-palavras será apenas o primeiro jogo disponível.

No futuro existirão outros jogos utilizando exatamente as mesmas categorias e o mesmo banco de palavras, como por exemplo:

* Caça-palavras
* Forca
* Quiz
* Palavras Cruzadas
* Jogo da Memória
* Complete a Palavra
* Associação de Conceitos

Portanto, a arquitetura deve ser preparada para reutilização de conteúdo entre diferentes jogos.

---

# Objetivo

Refatorar toda a estrutura de dados do projeto para que seja:

* Modular
* Escalável
* Reutilizável
* Desacoplada da GameEngine
* Preparada para SEO
* Preparada para internacionalização
* Preparada para crescimento futuro

A **GameEngine** nunca deve conhecer diretamente nenhuma categoria.

Ela deve apenas consumir uma fonte de dados padronizada.

---

# Estrutura desejada

```text
src/
├── data/
│   ├── categories/
│   │   ├── agropecuaria.ts
│   │   ├── informatica.ts
│   │   ├── animais.ts
│   │   ├── frutas.ts
│   │   ├── paises.ts
│   │   ├── capitais.ts
│   │   ├── historia.ts
│   │   ├── geografia.ts
│   │   ├── matematica.ts
│   │   ├── ciencias.ts
│   │   ├── biologia.ts
│   │   ├── fisica.ts
│   │   ├── quimica.ts
│   │   ├── esportes.ts
│   │   ├── filmes.ts
│   │   ├── series.ts
│   │   ├── tecnologia.ts
│   │   └── ...
│   │
│   ├── registry.ts
│   └── collections.ts
│
├── services/
│   ├── CategoryRegistry.ts
│   ├── RandomService.ts
│   └── SearchService.ts
│
├── types/
│   ├── Category.ts
│   ├── WordEntry.ts
│   ├── GameConfig.ts
│   └── ...
│
├── games/
│   ├── word-search/
│   ├── hangman/
│   ├── crossword/
│   └── ...
│
└── ...
```

---

# Estrutura das Categorias

Cada categoria deve possuir um arquivo próprio.

Exemplo:

```ts
const informatica: Category = {
  id: "informatica",

  slug: "informatica",

  name: "Informática",

  description:
    "Palavras relacionadas à informática, hardware, software e tecnologia.",

  color: "#2563EB",

  icon: "computer",

  cover: "",

  thumbnail: "",

  tags: [
    "tecnologia",
    "hardware",
    "software",
    "computador"
  ],

  seo: {
    title: "Caça-Palavras de Informática",

    description:
      "Jogue gratuitamente um caça-palavras com palavras de informática.",

    keywords: [
      "caça palavras informática",
      "hardware",
      "software",
      "computador"
    ]
  },

  words: [
    ...
  ]
}

export default informatica
```

---

# Estrutura das Palavras

As palavras não devem mais ser simples strings.

Cada palavra deve possuir uma estrutura preparada para futuras funcionalidades.

Exemplo:

```ts
{
  id: "computador",

  word: "COMPUTADOR",

  hint: "Equipamento utilizado para processamento de dados.",

  difficulty: "easy",

  image: "",

  audio: "",

  synonyms: [],

  translations: {},

  tags: []
}
```

Mesmo que alguns campos permaneçam vazios inicialmente.

---

# Category Registry

Criar um serviço responsável por registrar todas as categorias.

Responsabilidades:

* `getAllCategories()`
* `getCategory(id)`
* `getCategoryBySlug()`
* `search()`
* `getRelatedCategories()`
* `getCategoriesByCollection()`

Nenhum jogo deverá importar diretamente um arquivo de categoria.

Todos deverão utilizar o Registry.

---

# Collections

Criar coleções para organizar categorias.

Exemplo:

## Tecnologia

* Informática
* Hardware
* Programação
* Internet
* Inteligência Artificial

## Natureza

* Animais
* Plantas
* Flores
* Frutas

## Ciências

* Física
* Química
* Biologia

Essas coleções facilitarão navegação e SEO.

---

# GameConfig

Criar um arquivo central para configurações do jogo.

Exemplo:

* quantidade de palavras por dificuldade;
* tamanho do tabuleiro;
* número máximo de tentativas;
* letras disponíveis;
* configurações futuras.

Eliminar números fixos ("magic numbers") da GameEngine.

---

# RandomService

Centralizar toda geração aleatória.

Não utilizar `Math.random()` diretamente na GameEngine.

Isso permitirá futuramente:

* Daily Challenge
* Seed personalizada
* Reprodução da mesma partida
* Testes determinísticos

---

# GameEngine

A GameEngine deve ficar responsável apenas por:

* gerar o tabuleiro;
* solicitar palavras ao Registry;
* validar seleções;
* controlar o estado da partida.

Ela não deve conhecer:

* categorias;
* SEO;
* imagens;
* coleções;
* interface.

---

# Internacionalização

Preparar a arquitetura para suportar múltiplos idiomas.

Inicialmente:

* pt-BR

Preparar para:

* en-US
* es-ES

Sem necessidade de novas refatorações.

---

# Preparação para SEO

Cada categoria deverá conter:

* slug
* title
* description
* keywords
* canonical (opcional)
* cover
* thumbnail

Essas informações serão utilizadas futuramente para gerar páginas otimizadas automaticamente.

---

# Preparação para outros jogos

A mesma base de categorias deverá alimentar todos os jogos do portal.

Exemplo:

```text
Categoria "Informática"

├── Caça-Palavras
├── Forca
├── Quiz
├── Palavras Cruzadas
└── Jogo da Memória
```

Nenhum conteúdo deverá ser duplicado.

---

# Compatibilidade

Não alterar:

* algoritmo de geração do tabuleiro;
* algoritmo de posicionamento das palavras;
* validação das palavras;
* interface visual;
* seleção das letras.

O objetivo desta tarefa é apenas reorganizar a arquitetura dos dados.

---

# Qualidade do Código

Seguir as seguintes diretrizes:

* Utilizar TypeScript de forma consistente.
* Criar interfaces bem definidas.
* Eliminar duplicação de código.
* Aplicar princípios SOLID quando fizer sentido.
* Separar responsabilidades.
* Manter baixo acoplamento.
* Facilitar testes unitários.
* Escrever código limpo e documentado.

---

# Escalabilidade

A nova arquitetura deve suportar facilmente:

* mais de 100 categorias;
* milhares de palavras;
* novos idiomas;
* novos jogos;
* novos metadados.

Adicionar uma nova categoria deve exigir apenas:

1. Criar um novo arquivo.
2. Registrá-lo no Registry.

Nenhuma alteração na GameEngine deve ser necessária.

---

# Resultado Esperado

Ao concluir a implementação, apresentar um relatório contendo:

1. Arquivos criados.
2. Arquivos modificados.
3. Justificativa das decisões arquiteturais.
4. Como adicionar uma nova categoria.
5. Como adicionar um novo jogo utilizando a mesma base de dados.
6. Possíveis melhorias futuras.
7. Impactos positivos em escalabilidade, manutenção e preparação para SEO.

## Importante

Antes de implementar qualquer alteração:

* Analise toda a arquitetura atual do projeto.
* Preserve a compatibilidade com as funcionalidades existentes.
* Faça alterações incrementais, evitando regressões.
* Priorize uma arquitetura sustentável para os próximos anos de evolução do projeto.
