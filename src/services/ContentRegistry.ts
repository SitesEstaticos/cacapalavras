import { getCategories, getCategoryById } from '@/data/categories'
import type { Category, CategoryCollection, GameDefinition } from '@/types/Category'

export class ContentRegistry {
  getCategories(): Category[] {
    return getCategories()
  }

  getCategoryById(id: string): Category | undefined {
    return getCategoryById(id)
  }

  getCollections(): CategoryCollection[] {
    return [
      {
        id: 'educational-basics',
        slug: 'educational-basics',
        name: 'Fundamentos Educativos',
        description: 'Coleção inicial para explorar temas diversos.',
        categories: this.getCategories().map(category => category.id),
      },
    ]
  }

  getGames(): GameDefinition[] {
    return [
      {
        id: 'word-search',
        slug: 'word-search',
        name: 'Caça-Palavras',
        description: 'Modo clássico de caça-palavras com dicas e recompensas.',
        supportedCategoryIds: this.getCategories().map(category => category.id),
      },
    ]
  }
}

export const contentRegistry = new ContentRegistry()
