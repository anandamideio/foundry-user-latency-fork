// @ts-expect-error - required for module augmentation
import * as css from '../style.module.css'
import { MODULE_NAME } from '../constants'
import type { Pong } from './WebLatency'
import type moduleStyle from '../../types';

const styles = css as moduleStyle;

interface LatencyTimes { [key: string]: number }

export class PlayerList {
  private playerLatencyTimes: LatencyTimes = {}

  getId = (id: string) => `userLatencyText--${id}`

  registerListeners = () => {
    if (!('socket' in game)) {
      this.retryRegisterListeners()
      return
    }

    game.socket?.on(`module.${MODULE_NAME}`, (data: Pong) => {
      this.playerLatencyTimes[data.userId] = data.average
      this.updateLatencyText(data.userId)
    })
  }

  retryRegisterListeners = () => {
    console.error('Socket init timeout')
    setTimeout(() => {
      this.registerListeners()
    }, 5000)
  }

  updateSelf = (data: Pong) => {
    this.playerLatencyTimes[data.userId] = data.average
    this.updateLatencyText(data.userId)
  }

  updateLatencyText = (playerId: string) => {
    const gameInstance = game

    const playerLatency = this.playerLatencyTimes[playerId]
    const hideLatency = gameInstance.settings.get<boolean>(MODULE_NAME, 'hideLatency')
    const elmId = this.getId(playerId)
    const elm = (document.querySelector(`#${elmId}`) as HTMLSpanElement) ?? this.makeLatencySpan(playerId)

    elm.className = ''

    if (!playerLatency || hideLatency) {
      elm.classList.add(styles.userSpanHidden)
      return
    }

    const level = this.getLatencyLevel(playerLatency)
    const microLatency = gameInstance.settings.get<number>(MODULE_NAME, 'microLatency')

    if (microLatency) {
      elm.innerHTML =
        level === styles.userSpanGood ? '+' : level === styles.userSpanLow ? '&nbsp;' : '-'
      elm.title = `${playerLatency}ms`
      elm.classList.remove(styles.userSpan)
      elm.classList.add(styles.microLatency)
    } else {
      elm.classList.remove(styles.microLatency)
      elm.classList.add(styles.userSpan)
      elm.innerHTML = `${playerLatency}<em>ms</em>`
    }

    elm.classList.add(level)
  }

  getLatencyLevel = (playerLatency: number) => {
    if (playerLatency <= 100) return styles.userSpanGood
    if (playerLatency < 250) return styles.userSpanLow
    return styles.userSpanBad
  }

  makeLatencySpan = (playerId: string) => {
    const players = document.getElementById('players')

    if (!players) return null

    const span = document.createElement('span')
    span.id = this.getId(playerId)

    const playerElm = players.querySelector(`li[data-user-id="${playerId}"] .player-name`)

    if (playerElm) {
      playerElm.insertAdjacentElement('afterend', span)
    }

    return span
  }
}
