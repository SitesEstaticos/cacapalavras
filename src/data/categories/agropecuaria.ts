import type { Category } from '@/types/Category'

const agropecuaria: Category = {
  id: 'agropecuaria',
  slug: 'agropecuaria',
  name: 'Agropecuária',
  description: 'Palavras relacionadas à agricultura, pecuária, campo e produção.',
  color: '#16A34A',
  icon: 'tractor',
  cover: '',
  thumbnail: '',
  tags: ['agricultura', 'pecuária', 'campo', 'produção'],
  seo: {
    title: 'Caça-Palavras de Agropecuária',
    description: 'Palavras e conceitos de agropecuária para aprender brincando.',
    keywords: ['caça palavras agropecuária', 'agricultura', 'pecuária'],
  },
  words: [
    {
      id: 'agricultura',
      word: 'AGRICULTURA',
      hint: 'Atividade de cultivo de plantas e produção de alimentos.',
      difficulty: 'easy',
      image: '',
      audio: '',
      synonyms: [],
      translations: {},
      tags: ['campo'],
    },
    {
      id: 'pecuaria',
      word: 'PECUARIA',
      hint: 'Criação de animais para produção.',
      difficulty: 'easy',
      image: '',
      audio: '',
      translations: {},
      synonyms: [],
      tags: ['animais'],
    },
    {
      id: 'irrigacao',
      word: 'IRRIGACAO',
      hint: 'Suprimento de água para culturas.',
      difficulty: 'medium',
      image: '',
      audio: '',
      synonyms: [],
      translations: {},
      tags: ['água'],
    },
  ],
}

export default agropecuaria
