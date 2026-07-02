export interface CategorySEO {
  title: string
  description: string
  keywords: string[]
  canonical?: string
}

export interface CategoryWord {
  id: string
  word: string
  hint: string
  difficulty: 'easy' | 'medium' | 'hard'
  image: string
  audio: string
  synonyms: string[]
  translations: Record<string, string>
  tags: string[]
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  color: string
  icon: string
  cover: string
  thumbnail: string
  tags: string[]
  seo: CategorySEO
  words: CategoryWord[]
}

export interface CategoryCollection {
  id: string
  slug: string
  name: string
  description: string
  categories: string[]
}

export interface GameDefinition {
  id: string
  slug: string
  name: string
  description: string
  supportedCategoryIds: string[]
}
