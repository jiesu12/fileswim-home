import * as React from 'react'
import { isNumberKey, TEMPERATURE_PATTERN } from '../../util/StringUtil'
import { Editing, WeekDayNames } from './Scheduler'
import { WeeklySchedule, TemperatureAtTime, DailySchedule } from '../../api/dto'
import { toCelsius } from '../../util/temperatureUtil'

interface Props {
  celsius: boolean
  editing: Editing
  close: () => void
  weeklySchedule: WeeklySchedule
  updateSchedule: (schedule: WeeklySchedule) => void
}

const ScheduleTempTimeEditor = ({
  celsius,
  weeklySchedule,
  editing,
  close,
  updateSchedule,
}: Props) => {
  const [temp, setTemp] = React.useState<string>('') // use string to avoid long float number
  const [secondsOfDay, setSecondsOfday] = React.useState<number>(0)

  React.useEffect(() => {
    if (editing.temperature !== null) {
      setTemp(editing.temperature)
    }
    if (editing.secondsOfDay !== null) {
      setSecondsOfday(editing.secondsOfDay)
    }
    // eslint-disable-next-line
  }, [])

  const handleAdd = () => {
    const weekday = editing.weekday
    const newTemp = celsius ? Number(temp) : toCelsius(Number(temp))
    const newTempTime: TemperatureAtTime = {
      temperature: newTemp,
      seconds_of_day: secondsOfDay,
    }
    const updatedWeeklySchedule: WeeklySchedule = weeklySchedule ? [...weeklySchedule] : []
    const updatedDailySchedule: DailySchedule = updatedWeeklySchedule[weekday]
      ? [...updatedWeeklySchedule[weekday]].filter((v) => v.seconds_of_day !== editing.secondsOfDay)
      : []
    updatedDailySchedule.push(newTempTime)
    updatedDailySchedule.sort((a, b) => a.seconds_of_day - b.seconds_of_day)
    updatedWeeklySchedule[weekday] = updatedDailySchedule
    updateSchedule(updatedWeeklySchedule)
    close()
  }

  const handleDelete = () => {
    const weekday = editing.weekday
    const updatedWeeklySchedule: WeeklySchedule = weeklySchedule ? [...weeklySchedule] : []
    const updatedDailySchedule: DailySchedule = updatedWeeklySchedule[weekday]
      ? [...updatedWeeklySchedule[weekday]].filter((v) => v.seconds_of_day !== editing.secondsOfDay)
      : []
    updatedWeeklySchedule[weekday] = updatedDailySchedule
    updateSchedule(updatedWeeklySchedule)
    close()
  }

  const handleInputChange = (e: any) => {
    const value = e.target.value
    if (TEMPERATURE_PATTERN.test(value)) {
      setTemp(value)
    } else {
      e.preventDefault()
    }
  }

  const handleHourChange = (e: any) => {
    const hour = Number(e.target.value)
    const seconds = secondsOfDay % 3600
    setSecondsOfday(hour * 3600 + seconds)
  }

  const handleMinuteChange = (e: any) => {
    const mintue = Number(e.target.value)
    const hours = Math.floor(secondsOfDay / 3600)
    setSecondsOfday(hours * 3600 + mintue * 60)
  }

  const renderTime = () => {
    const hour = secondsOfDay ? Math.floor(secondsOfDay / 3600) : 0
    const minute = secondsOfDay ? Math.floor((secondsOfDay % 3600) / 60) : 0
    return (
      <div>
        <input value={hour} onChange={handleHourChange} />
        <span>:</span>
        <input value={minute} onChange={handleMinuteChange} />
      </div>
    )
  }

  return (
    <div className='schedule-temp-time-editor'>
      {WeekDayNames[editing.weekday]}
      <table>
        <tbody>
          <tr>
            <td>Time</td>
            <td>{renderTime()}</td>
          </tr>
          <tr>
            <td>Temperature</td>
            <td>
              <input
                className='form-control temperature-input'
                type='text'
                onKeyDown={isNumberKey}
                value={temp}
                onChange={handleInputChange}
                size={5}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className='btn-panel'>
        <button onClick={handleAdd} disabled={temp === ''}>
          Add
        </button>
        <button onClick={handleDelete} disabled={editing.secondsOfDay === null}>
          Delete
        </button>
        <button onClick={close}>Cancel</button>
      </div>
    </div>
  )
}

export default ScheduleTempTimeEditor
