"use client"

import { BKC_PIDS, buildPidCommand, type PidDef } from "./commands"
import { parseElm327Response } from "./parser"
import type { Obd2Reading } from "@/types"

// ELM327 Bluetooth service UUID (standard for most ELM327 BT adapters)
const ELM327_SERVICE_UUID = "0000fff0-0000-1000-8000-00805f9b34fb"
const ELM327_NOTIFY_CHAR_UUID = "0000fff1-0000-1000-8000-00805f9b34fb"
const ELM327_WRITE_CHAR_UUID = "0000fff2-0000-1000-8000-00805f9b34fb"

// Some adapters use a different UUID
const ELM327_SPP_SERVICE_UUID = "00001101-0000-1000-8000-00805f9b34fb"

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error"

export type Obd2AdapterState = {
  status: ConnectionStatus
  error?: string
  readings: Record<string, Obd2Reading>
}

export class Elm327Adapter {
  private device: BluetoothDevice | null = null
  private writeChar: BluetoothRemoteGATTCharacteristic | null = null
  private notifyChar: BluetoothRemoteGATTCharacteristic | null = null
  private responseBuffer = ""
  private pendingResolve: ((value: string) => void) | null = null
  private pollInterval: ReturnType<typeof setInterval> | null = null
  private onStateChange: (state: Obd2AdapterState) => void
  private readings: Record<string, Obd2Reading> = {}

  constructor(onStateChange: (state: Obd2AdapterState) => void) {
    this.onStateChange = onStateChange
  }

  static isSupported(): boolean {
    return typeof navigator !== "undefined" && "bluetooth" in navigator
  }

  private emit(status: ConnectionStatus, error?: string) {
    this.onStateChange({ status, error, readings: { ...this.readings } })
  }

  private emitReadings() {
    this.onStateChange({ status: "connected", readings: { ...this.readings } })
  }

  async connect(): Promise<void> {
    if (!Elm327Adapter.isSupported()) {
      this.emit("error", "Web Bluetooth is not supported in this browser. Use Chrome or Edge.")
      return
    }

    this.emit("connecting")

    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [ELM327_SERVICE_UUID] }, { services: [ELM327_SPP_SERVICE_UUID] }],
        optionalServices: [ELM327_SERVICE_UUID, ELM327_SPP_SERVICE_UUID],
      })

      const server = await this.device.gatt!.connect()
      const service = await server
        .getPrimaryService(ELM327_SERVICE_UUID)
        .catch(() => server.getPrimaryService(ELM327_SPP_SERVICE_UUID))

      this.writeChar = await service
        .getCharacteristic(ELM327_WRITE_CHAR_UUID)
        .catch(() => service.getCharacteristics().then((cs) => cs[1]))

      this.notifyChar = await service
        .getCharacteristic(ELM327_NOTIFY_CHAR_UUID)
        .catch(() => service.getCharacteristics().then((cs) => cs[0]))

      await this.notifyChar!.startNotifications()
      this.notifyChar!.addEventListener("characteristicvaluechanged", this.handleNotification.bind(this))

      this.device.addEventListener("gattserverdisconnected", this.handleDisconnect.bind(this))

      await this.initialize()
      this.emit("connected")
      this.startPolling()
    } catch (err) {
      this.emit("error", err instanceof Error ? err.message : "Connection failed")
    }
  }

  private handleNotification(event: Event) {
    const target = event.target as BluetoothRemoteGATTCharacteristic
    const value = new TextDecoder().decode(target.value)
    this.responseBuffer += value

    if (this.responseBuffer.includes(">")) {
      const response = this.responseBuffer
      this.responseBuffer = ""
      if (this.pendingResolve) {
        this.pendingResolve(response)
        this.pendingResolve = null
      }
    }
  }

  private handleDisconnect() {
    this.stopPolling()
    this.emit("disconnected")
  }

  private sendCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingResolve = null
        reject(new Error("Command timeout"))
      }, 3000)

      this.pendingResolve = (value: string) => {
        clearTimeout(timeout)
        resolve(value)
      }

      const bytes = new TextEncoder().encode(command)
      this.writeChar!.writeValue(bytes).catch(reject)
    })
  }

  private async initialize() {
    await this.sendCommand("ATZ\r")   // Reset
    await this.sendCommand("ATE0\r")  // Echo off
    await this.sendCommand("ATL0\r")  // Linefeeds off
    await this.sendCommand("ATSP0\r") // Auto protocol
    await this.sendCommand("ATH0\r")  // Headers off
  }

  private async pollPid(pid: PidDef): Promise<void> {
    try {
      const command = buildPidCommand(pid)
      const response = await this.sendCommand(command)
      const reading = parseElm327Response(response, pid)
      if (reading) {
        this.readings[pid.pid] = reading
      }
    } catch {
      // Individual PID failures are non-fatal
    }
  }

  private startPolling() {
    this.pollInterval = setInterval(async () => {
      for (const pid of BKC_PIDS) {
        await this.pollPid(pid)
      }
      this.emitReadings()
    }, 1000)
  }

  private stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
  }

  disconnect() {
    this.stopPolling()
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect()
    }
    this.emit("disconnected")
  }
}
