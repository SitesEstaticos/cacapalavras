export type GameEventName =
  | 'HintUsed'
  | 'HintGranted'
  | 'RewardRequested'
  | 'RewardLoaded'
  | 'RewardStarted'
  | 'RewardCompleted'
  | 'RewardGranted'
  | 'RewardClosed'
  | 'RewardFailed'
  | 'RewardCooldownStarted'
  | 'RewardCooldownFinished'

export type GameEventHandler<T = unknown> = (payload: T) => void

export class GameEventBus {
  private handlers = new Map<GameEventName, Set<GameEventHandler>>()

  subscribe<T = unknown>(eventName: GameEventName, handler: GameEventHandler<T>): () => void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set())
    }

    const handlers = this.handlers.get(eventName)
    handlers?.add(handler as GameEventHandler)

    return () => {
      handlers?.delete(handler as GameEventHandler)
    }
  }

  publish<T = unknown>(eventName: GameEventName, payload?: T): void {
    this.handlers.get(eventName)?.forEach(handler => handler(payload))
  }

  clear(eventName?: GameEventName): void {
    if (eventName) {
      this.handlers.delete(eventName)
      return
    }

    this.handlers.clear()
  }
}
