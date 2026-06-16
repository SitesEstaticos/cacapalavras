// Guia de Desenvolvimento

/*

## 🚀 Começando o Desenvolvimento

### 1. Setup Inicial

```bash
# Clonar projeto
git clone <repo>
cd caca-palavras

# Instalar dependências
npm install

# Copiar .env.example para .env.local
cp .env.example .env.local

# Iniciar dev server
npm run dev
```

### 2. Estrutura de Desenvolvimento

```
src/
├── app/                    # App principal
├── core/                   # Configurações e constantes
├── domain/                 # Modelos puros
├── services/               # Lógica de negócio
├── hooks/                  # Hooks React customizados
├── components/             # Componentes React
├── features/               # Features modulares (futura expansão)
├── pages/                  # Páginas de rota
├── shared/                 # Utilitários compartilhados
├── styles/                 # CSS global
├── types/                  # Tipos TypeScript
├── utils/                  # Funções helper
├── adapters/               # Adaptadores (Storage, Ads, etc)
└── main.tsx                # Entry point
```

## 📝 Fluxo de Trabalho

### Adicionar Nova Feature

1. **Criar tipo em `src/types/index.ts`**

```typescript
export interface MinhaFeature {
  id: string
  name: string
  // ...
}
```

2. **Criar serviço em `src/services/`**

```typescript
export class MinhaFeatureService {
  async fazer() { /* ... */ }
}
```

3. **Criar hook em `src/hooks/index.ts`**

```typescript
export const useMeuHook = () => {
  const service = new MinhaFeatureService()
  // Gerenciar estado
}
```

4. **Usar em componente ou página**

```typescript
const MinhaComponent = () => {
  const { dados } = useMeuHook()
  return <div>{/* ... */}</div>
}
```

## 🎯 Convenções de Código

### Nomes de Arquivos

```
Components:       PascalCase.tsx
Services:         PascalCase.ts
Hooks:            useHookName.ts
Types:            index.ts
Utils:            camelCase.ts
```

### Componentes React

```typescript
// ✅ Bom
interface CellProps {
  letter: string
  isSelected: boolean
  onClick: () => void
}

export const Cell: React.FC<CellProps> = ({
  letter,
  isSelected,
  onClick,
}) => {
  return <div onClick={onClick}>{letter}</div>
}

// ❌ Ruim
const Cell = (props: any) => {
  return <div onClick={props.onClick}>{props.letter}</div>
}
```

### Serviços

```typescript
// ✅ Bom
export class GameEngine {
  private board: GameBoard

  constructor() {
    this.board = this.initializeBoard(10, 10)
  }

  generateBoard(difficulty: GameDifficulty): GameBoard {
    // Implementação
  }
}

// ❌ Ruim
export const gameEngine = {
  generateBoard: (difficulty) => {
    // Sem tipo, sem estrutura
  },
}
```

### Imports

```typescript
// ✅ Bom
import { GameEngine } from '@services/GameEngine'
import { GameDifficulty } from '@types/index'
import { formatTime } from '@utils/helpers'

// ❌ Ruim
import { GameEngine } from '../../services/GameEngine'
import GameDifficulty from '../../../types'
import { formatTime } from '../utils'
```

## 🔧 Adicionando Novos Adaptadores

### 1. Definir interface em `src/adapters/index.ts`

```typescript
export interface IMinhaPlataforma {
  fazer(): Promise<void>
}
```

### 2. Implementar para Web

```typescript
export class MinhaPlataformaWeb implements IMinhaPlataforma {
  async fazer(): Promise<void> {
    // Implementação web
  }
}
```

### 3. Implementar para React Native

```typescript
export class MinhaPlataformaReactNative implements IMinhaPlataforma {
  async fazer(): Promise<void> {
    // Implementação mobile
  }
}
```

## ✅ Checklist de Pull Request

- [ ] Código segue convenções do projeto
- [ ] TypeScript sem `any`
- [ ] Testes cobrem lógica principal
- [ ] Nenhuma dependência externa desnecessária
- [ ] Adaptadores usados quando aplicável
- [ ] Arquivos organizados por camada
- [ ] Commit messages em português claro
- [ ] Sem console.log em produção

## 🐛 Debugging

### VS Code Launch Config

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Vite Dev",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathPrefix": "webpack://"
    }
  ]
}
```

### React Developer Tools

```bash
npm install -D react-devtools
```

## 📱 Testando em Mobile

```bash
# Iniciar em modo mobile no navegador
npm run dev

# Acessar em dispositivo
# Encontre o IP da máquina:
ipconfig getifaddr en0  # Mac
hostname -I            # Linux
ipconfig               # Windows

# Então acesse no dispositivo
http://<seu-ip>:5173
```

## 🚢 Deploy

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Deploy em Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Deploy em Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 📦 Adicionando Dependências

### Antes de instalar

- Verificar alternativas mais leves
- Considerar tamanho do bundle
- Verificar compatibilidade com React Native

### Boas dependências

```json
{
  "zustand": "Gerenciamento de estado leve",
  "@tanstack/react-query": "Data fetching",
  "framer-motion": "Animações",
  "clsx": "Class names condicional"
}
```

### Evitar

```json
{
  "redux": "Muito boilerplate",
  "lodash": "Use alternativas nativas",
  "jquery": "Não necessário em React"
}
```

## 🎨 Temas e Estilos

### Adicionar cor nova

1. Adicionar em `tailwind.config.js`

```javascript
colors: {
  myColor: '#ABC123',
}
```

2. Adicionar em `src/core/constants.ts`

```typescript
export const COLORS = {
  MY_COLOR: '#ABC123',
}
```

3. Usar em componentes

```typescript
<div className="bg-myColor"></div>
```

## 🔐 Segurança

### Não committar

- Chaves de API
- Tokens
- Senhas
- Dados pessoais

### Usar `.env` para

- URLs de API
- IDs de publicador
- Flags de feature

## 📚 Recursos Úteis

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev)
- [React Native Docs](https://reactnative.dev)

*/
