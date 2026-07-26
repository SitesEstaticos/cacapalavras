# Implementação do Sistema de Dicas e Recompensas

## Contexto

Este projeto será um portal de jogos educativos desenvolvido em React + Vite + TypeScript.

O caça-palavras é apenas o primeiro jogo.

O sistema implementado deve ser reutilizável por qualquer jogo do portal.

Não desenvolver uma solução específica para o caça-palavras.

Criar uma arquitetura genérica, desacoplada e escalável.

---

# Objetivo

Implementar um sistema de dicas (Hints) e recompensas (Rewards).

O sistema deverá permitir futuramente:

- desbloquear dicas;
- ganhar vidas;
- ganhar moedas;
- pular fase;
- desbloquear categorias;
- desbloquear níveis;
- recompensas diárias;
- boosters;
- anúncios recompensados (Rewarded Ads).

A arquitetura deve estar preparada para todas essas funcionalidades.

---

# Sistema de dicas

Cada partida inicia com:

- 3 dicas gratuitas.

Sempre que o jogador utilizar uma dica:

3 → 2 → 1 → 0

Ao chegar em zero:

- desabilitar o botão de dica;
- exibir o botão "Ganhar mais uma dica".

As dicas pertencem à partida atual.

Ao iniciar uma nova partida:

- restaurar para 3 dicas.

---

# Funcionamento da dica

Inicialmente, no caça-palavras, uma dica deverá:

- destacar temporariamente a primeira letra de uma palavra ainda não encontrada.

Regras:

- nunca selecionar uma palavra já encontrada;
- nunca repetir a mesma dica;
- caso todas as palavras restantes já tenham recebido dica, selecionar outra estratégia (por exemplo destacar temporariamente uma palavra).

A arquitetura deve permitir implementar outros tipos de dica futuramente sem alterar o sistema.

---

# Recompensa por anúncio

Quando não houver mais dicas:

Ao clicar em:

"Ganhar mais uma dica"

o sistema deverá solicitar um Rewarded Ad utilizando o Google Ad Manager.

O projeto já possui o script do Google Ad Manager.

Reutilizar essa implementação existente.

Não criar MockRewardProvider.

Implementar uma integração real.

Criar a interface:

```ts
interface RewardProvider {
    showRewardedAd(): Promise<boolean>;
}
```

Implementar:

```ts
class GoogleAdManagerProvider implements RewardProvider
```

O RewardService deverá depender apenas da interface RewardProvider.

Nunca depender diretamente do Google Ad Manager.

---

# Fluxo esperado

Jogador

↓

0 dicas

↓

Clica em "Ganhar mais uma dica"

↓

Solicita Rewarded Ad

↓

Anúncio disponível?

↓

SIM

↓

Anúncio carregado

↓

Usuário assistiu completamente

↓

Reward callback recebido

↓

Adicionar +1 dica

↓

Atualizar interface

↓

Botão volta para:

"Dica (1)"

---

Caso:

- anúncio indisponível;
- erro de carregamento;
- usuário fechar o anúncio;
- timeout;
- erro do provider;
- perda de conexão;

Nenhuma dica deverá ser concedida.

Mostrar uma mensagem amigável ao usuário.

---

# Controle de segurança

Garantir:

- apenas um anúncio pode ser solicitado por vez;
- impedir múltiplos cliques;
- impedir múltiplas recompensas;
- impedir callbacks duplicados;
- impedir race conditions;
- impedir duas recompensas para o mesmo anúncio.

Uma recompensa só pode ser concedida uma única vez após confirmação oficial do Google Ad Manager.

---

# Cooldown

Após receber uma recompensa:

bloquear nova solicitação durante um período configurável.

Criar uma configuração centralizada.

Exemplo:

```ts
rewardCooldown: 30
```

O valor deverá ser facilmente alterado futuramente.

Durante o cooldown:

- desabilitar o botão;
- mostrar contador regressivo.

---

# Durante o anúncio

Enquanto o Rewarded Ad estiver aberto:

- pausar cronômetro;
- bloquear tabuleiro;
- bloquear seleção;
- bloquear botões;
- impedir qualquer interação.

Ao finalizar:

- restaurar completamente o estado anterior;
- continuar o cronômetro;
- liberar a recompensa apenas após confirmação oficial.

---

# HintService

Criar um serviço responsável pelas dicas.

Responsabilidades:

- getRemainingHints()
- useHint()
- addHints()
- resetHints()
- canUseHint()

Nenhum componente poderá alterar diretamente o número de dicas.

---

# RewardService

Criar um serviço responsável por:

- solicitar recompensa;
- validar recompensa;
- entregar recompensa.

Responsabilidades:

- requestReward()
- claimReward()
- getProvider()

---

# GameState

Adicionar ao estado da partida:

- remainingHints
- usedHints
- rewardedHints
- rewardedAdsWatched
- gameStart
- gameFinish

Todos esses dados devem ser reiniciados ao iniciar uma nova partida.

---

# Interface

Enquanto houver dicas:

Dica (3)

↓

Dica (2)

↓

Dica (1)

Ao acabar:

Ganhar mais uma dica

Durante carregamento:

Carregando anúncio...

Durante cooldown:

Disponível em XX segundos

---

# Eventos

Criar eventos internos para analytics.

HintUsed

HintGranted

RewardRequested

RewardLoaded

RewardStarted

RewardCompleted

RewardGranted

RewardClosed

RewardFailed

RewardCooldownStarted

RewardCooldownFinished

Esses eventos deverão estar desacoplados do restante da aplicação.

---

# Persistência

Preparar a arquitetura para futuramente persistir:

- dicas;
- anúncios assistidos;
- recompensas;
- estatísticas.

Não implementar persistência agora.

Apenas estruturar o código.

---

# Compatibilidade

Não alterar:

- algoritmo de geração do tabuleiro;
- posicionamento das palavras;
- validação das palavras;
- arquitetura da GameEngine;
- interface existente, exceto os componentes relacionados às dicas.

---

# Qualidade

Seguir princípios SOLID.

Evitar acoplamento.

Criar interfaces bem definidas.

Utilizar TypeScript de forma consistente.

Organizar os serviços em módulos reutilizáveis.

Preparar a arquitetura para reutilização em qualquer jogo do portal.

---

# Resultado esperado

Ao finalizar apresentar:

- arquivos criados;
- arquivos modificados;
- arquitetura implementada;
- fluxo completo de recompensa;
- fluxo completo das dicas;
- integração realizada com o Google Ad Manager;
- como adicionar novos provedores futuramente;
- justificativa das decisões técnicas.

Não simplificar a implementação.

Priorizar qualidade, escalabilidade, reutilização e facilidade de manutenção.