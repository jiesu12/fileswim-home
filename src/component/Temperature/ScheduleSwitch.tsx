import { postJson } from '@jiesu12/fileswim-api'
import * as React from 'react'
import { Thermostat, THERMOSTAT_URL } from './Temperature'

interface Props {
  useSchedule: boolean
  setThermostat: (t: Thermostat) => void
}

const ScheduleSwitch = ({ useSchedule, setThermostat }: Props) => {
  const turnSwitch = () => {
    postJson(`${THERMOSTAT_URL}/schedule/use/${!useSchedule}`).then(setThermostat)
  }
  return (
    <div className='schedule-switch'>
      Scheduler{' '}
      <span className='switch' onClick={turnSwitch}>
        {useSchedule ? 'On' : 'Off'}
      </span>
    </div>
  )
}

export default ScheduleSwitch
