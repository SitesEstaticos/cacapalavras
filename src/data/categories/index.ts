import agropecuaria from './agropecuaria'
import ciencias from './ciencias'
import tecnologia from './tecnologia'
import biblica from './biblica' 
import type { Category, CategoryCollection, GameDefinition } from '@/types/Category'

export const categories: Record<string, Category> = {
  [agropecuaria.id]: agropecuaria,
  [ciencias.id]: ciencias,
  [tecnologia.id]: tecnologia,
  [biblica.id]: biblica,
}

export const categoryCollections: CategoryCollection[] = [
  {
    id: 'educational-basics',
    slug: 'educational-basics',
    name: 'Fundamentos Educativos',
    description: 'Coleção inicial para explorar temas diversos.',
    categories: [agropecuaria.id, ciencias.id, tecnologia.id, biblica.id],

  },
]

export const gameDefinitions: GameDefinition[] = [
  {
    id: 'word-search',
    slug: 'word-search',
    name: 'Caça-Palavras',
    description: 'Modo clássico de caça-palavras com dicas e recompensas.',
    supportedCategoryIds: [agropecuaria.id, ciencias.id, tecnologia.id],
  },
]

export const getCategoryById = (id: string): Category | undefined => categories[id]
export const getCategoryIds = (): string[] => Object.keys(categories)
export const getCategories = (): Category[] => Object.values(categories)
