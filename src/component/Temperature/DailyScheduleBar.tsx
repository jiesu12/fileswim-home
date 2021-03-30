import * as React from 'react'
import { WeekDayNames, Editing } from './Scheduler'
import { DailySchedule, TemperatureAtTime } from '../../api/dto'
import { toFahrenheit } from '../../util/temperatureUtil'
import { getTimeWithPadding } from '../../util/StringUtil'

const PX_PER_SEC = 720 / (3600 * 24)

interface Props {
  celsius: boolean
  weekday: number
  schedule?: DailySchedule
  showTempTimeEditor: (editing: Editing) => void
  showCopyEditor: (weekday: number) => void
}

const DailyScheduleBar = ({
  celsius,
  weekday,
  schedule,
  showTempTimeEditor,
  showCopyEditor,
}: Props) => {
  const addNewTempTime = () => {
    const editing: Editing = {
      weekday,
      temperature: null,
      secondsOfDay: null,
    }
    showTempTimeEditor(editing)
  }

  const editTempTime = (tt: TemperatureAtTime, e: any) => {
    e.preventDefault()
    e.stopPropagation()
    const editing: Editing = {
      weekday,
      temperature: celsius ? tt.temperature.toFixed(0) : toFahrenheit(tt.temperature).toFixed(0),
      secondsOfDay: tt.seconds_of_day,
    }
    showTempTimeEditor(editing)
  }

  const getTitle = (tt: TemperatureAtTime) => {
    const hour = Math.floor(tt.seconds_of_day / 3600)
    const minute = (tt.seconds_of_day % 3600) / 60
    return `${getTimeWithPadding(hour)}:${getTimeWithPadding(minute)}`
  }

  const renderTempTime = (tt: TemperatureAtTime) => {
    return (
      <div
        className='temperature-at-time'
        key={tt.seconds_of_day}
        style={{ left: Math.floor(PX_PER_SEC * tt.seconds_of_day) + 'px' }}
        onClick={(e) => editTempTime(tt, e)}
        title={getTitle(tt)}
      >
        {celsius ? tt.temperature : toFahrenheit(tt.temperature)}
      </div>
    )
  }
  return (
    <div className='daily-schedule'>
      <div className='week-day-name' onClick={() => showCopyEditor(weekday)} title='Click to copy'>
        {WeekDayNames[weekday]}
      </div>
      <div className='temperatures-at-time' onClick={addNewTempTime}>
        {schedule && schedule.map((s) => renderTempTime(s))}
      </div>
    </div>
  )
}

export default DailyScheduleBar
