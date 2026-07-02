import type { Category } from '@/types/Category'

const tecnologia: Category = {
  id: 'tecnologia',
  slug: 'tecnologia',
  name: 'Tecnologia',
  description: 'Palavras relacionadas a computadores, internet e ferramentas digitais.',
  color: '#7C3AED',
  icon: 'cpu',
  cover: '',
  thumbnail: '',
  tags: ['computação', 'internet', 'tecnologia'],
  seo: {
    title: 'Caça-Palavras de Tecnologia',
    description: 'Aprenda conceitos tecnológicos com um caça-palavras interativo.',
    keywords: ['caça palavras tecnologia', 'computador', 'internet'],
  },
  words: [
    {
      id: 'computador',
      word: 'COMPUTADOR',
      hint: 'Máquina usada para processar informações.',
      difficulty: 'easy',
      image: '',
      audio: '',
      synonyms: [],
      translations: {},
      tags: ['hardware'],
    },
    {
      id: 'internet',
      word: 'INTERNET',
      hint: 'Rede global de comunicação digital.',
      difficulty: 'easy',
      image: '',
      audio: '',
      synonyms: [],
      translations: {},
      tags: ['rede'],
    },
    {
      id: 'software',
      word: 'SOFTWARE',
      hint: 'Conjunto de programas de um sistema.',
      difficulty: 'medium',
      image: '',
      audio: '',
      synonyms: [],
      translations: {},
      tags: ['programação'],
    },
  ],
}

export default tecnologia
