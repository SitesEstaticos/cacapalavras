import type { Category } from '@/types/Category'

const ciencias: Category = {
  id: 'ciencias',
  slug: 'ciencias',
  name: 'Ciências',
  description: 'Palavras relacionadas ao mundo natural, planetas e fenômenos.',
  color: '#2563EB',
  icon: 'atom',
  cover: '',
  thumbnail: '',
  tags: ['natureza', 'planeta', 'física'],
  seo: {
    title: 'Caça-Palavras de Ciências',
    description: 'Explore conceitos científicos com palavras e dicas.',
    keywords: ['caça palavras ciências', 'natureza', 'planeta'],
  },
  words: [
    {
      id: 'planeta',
      word: 'PLANETA',
      hint: 'Corpo celeste que orbita uma estrela.',
      difficulty: 'easy',
      image: '',
      audio: '',
      synonyms: [],
      translations: {},
      tags: ['espaço'],
    },
    {
      id: 'atomo',
      word: 'ATOMO',
      hint: 'Menor unidade de um elemento químico.',
      difficulty: 'medium',
      image: '',
      audio: '',
      synonyms: [],
      translations: {},
      tags: ['química'],
    },
  ],
}

export default ciencias
