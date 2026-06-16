// Guia de Migração para React Native

/*

## 🚀 Passo a Passo para React Native + Expo

### 1. Estrutura de Pastas Recomendada

```
projeto/
├── packages/
│   ├── shared/              # Lógica compartilhada (GameEngine, Services)
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── adapters/
│   │   └── package.json
│   ├── web/                 # Aplicação Web (React + Vite)
│   │   ├── src/
│   │   └── package.json
│   └── mobile/              # Aplicação Mobile (React Native + Expo)
│       ├── app/
│       ├── src/
│       └── package.json
```

### 2. Adapters para React Native

```typescript
// adapters/StorageAdapter.ts
export class ReactNativeStorageAdapter implements IStorageAdapter {
  constructor(private asyncStorage: typeof AsyncStorage) {}

  async getItem(key: string): Promise<string | null> {
    return this.asyncStorage.getItem(key)
  }

  async setItem(key: string, value: string): Promise<void> {
    return this.asyncStorage.setItem(key, value)
  }

  async removeItem(key: string): Promise<void> {
    return this.asyncStorage.removeItem(key)
  }

  async getAllKeys(): Promise<string[]> {
    return this.asyncStorage.getAllKeys()
  }

  async clear(): Promise<void> {
    return this.asyncStorage.clear()
  }
}
```

### 3. Ads com React Native

```typescript
// adapters/RewardedAdAdapter.ts
import { InterstitialAd, RewardedAd, BannerAd } from 'react-native-google-mobile-ads'

export class GoogleMobileAdsProvider implements IRewardedAdProvider {
  private rewardedAd: RewardedAd

  constructor(adUnitId: string) {
    this.rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: false,
    })
  }

  async isReady(): Promise<boolean> {
    return this.rewardedAd.loaded
  }

  async show(): Promise<void> {
    return this.rewardedAd.show()
  }

  async load(): Promise<void> {
    return this.rewardedAd.load()
  }

  onAdRewarded = (callback: () => void) => {
    this.rewardedAd.addOnAdEvent('rewarded', callback)
  }

  onAdClosed = (callback: () => void) => {
    this.rewardedAd.addOnAdEvent('closed', callback)
  }

  onAdFailed = (callback: (error: Error) => void) => {
    this.rewardedAd.addOnAdEvent('error', callback)
  }
}
```

### 4. Analytics com Firebase

```typescript
// adapters/FirebaseAnalyticsAdapter.ts
import analytics from '@react-native-firebase/analytics'

export class FirebaseAnalyticsAdapter implements IAnalyticsAdapter {
  async logEvent(eventName: string, params?: Record<string, string | number>): Promise<void> {
    await analytics().logEvent(eventName, params)
  }

  async setUserProperty(key: string, value: string | number): Promise<void> {
    await analytics().setUserProperty(key, String(value))
  }

  async logError(error: Error, context?: Record<string, unknown>): Promise<void> {
    await analytics().logEvent('error', {
      message: error.message,
      ...context,
    })
  }
}
```

### 5. Componentes para React Native

```typescript
// components/mobile/Board.tsx
import { View, ScrollView } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

export const Board: React.FC<BoardProps> = ({ grid, ... }) => {
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      // Handle tap
    })

  const panGesture = Gesture.Pan()
    .onUpdate(({ x, y }) => {
      // Handle drag
    })
    .onEnd(() => {
      // Validate selection
    })

  return (
    <GestureDetector gesture={Gesture.Simultaneous(tapGesture, panGesture)}>
      <View style={styles.container}>
        {/* Renderizar células */}
      </View>
    </GestureDetector>
  )
}
```

### 6. Dependências React Native

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.73.0",
    "expo": "^50.0.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "@react-native-firebase/analytics": "^18.0.0",
    "@react-native-firebase/app": "^18.0.0",
    "react-native-google-mobile-ads": "^12.0.0",
    "react-native-gesture-handler": "^2.14.0",
    "react-native-reanimated": "^3.5.0",
    "zustand": "^4.4.0"
  }
}
```

### 7. Reutilizar Lógica

```typescript
// Compartilhado entre Web e Mobile
export class GameEngine {
  generateBoard(difficulty) { /* ... */ }
  validateSelection(positions) { /* ... */ }
  markWordAsFound(wordId) { /* ... */ }
}

// Web - usar como agora
const engine = new GameEngine()
const board = engine.generateBoard(difficulty)

// Mobile - usar exatamente igual
const engine = new GameEngine()
const board = engine.generateBoard(difficulty)
```

### 8. Navegação para React Native

```typescript
// navigation/RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

### 9. Temas para Mobile

```typescript
// themes/mobile.ts
export const mobileTheme = {
  colors: {
    primary: '#1A535C',
    secondary: '#4ECDC4',
    background: '#0B1220',
    surface: '#0B1220',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    body: { fontSize: 16 },
  },
}
```

### 10. Suporte a Tema Escuro/Claro

```typescript
import { useColorScheme } from 'react-native'

export const GameScreen = () => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <View style={{ backgroundColor: isDark ? '#0B1220' : '#FFFFFF' }}>
      {/* ... */}
    </View>
  )
}
```

## ✅ Vantagens desta Arquitetura

1. **Reutilização Total**: GameEngine, Services, Types são 100% compartilhados
2. **Sem Duplicação**: A lógica de jogo não é duplicada
3. **Manutenção Fácil**: Correções no core beneficiam ambas plataformas
4. **Testes Simples**: Testar GameEngine uma vez é suficiente
5. **CI/CD Integrado**: Mesmo pipeline de testes para ambas plataformas
6. **Escalabilidade**: Adicionar nova plataforma é apenas criar novos adaptadores

## 📦 Monorepo com pnpm/yarn workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/shared'
  - 'packages/web'
  - 'packages/mobile'
```

```bash
# Instalar tudo
pnpm install

# Executar em um workspace específico
pnpm -F @caca-palavras/web dev

# Executar em todos
pnpm -r run build
```

*/
