export interface GarageStatus {
  status: string
  timestamp: number
}

export interface GarageAlertStatus {
  alert: boolean
}

export interface TemperatureStatus {
  temperature: number
  humidity: number
  timestamp: number
}

export interface HistoryTotal {
  total: number
}

export interface TemperatureAtTime {
  seconds_of_day: number
  temperature: number
}

export type DailySchedule = Array<TemperatureAtTime>

export type WeeklySchedule = Array<DailySchedule>
