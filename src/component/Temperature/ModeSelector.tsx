import { postJson } from '@jiesu12/fileswim-api'
import * as React from 'react'
import { Thermostat, THERMOSTAT_URL } from './Temperature'

interface Props {
  thermostat: Thermostat
  setThermostat: (t: Thermostat) => void
  setterMode: boolean
}

const ModeSelector = ({ thermostat, setThermostat, setterMode }: Props) => {
  return (
    <div className='mode-selection'>
      <button
        className={`btn btn-sm btn-${thermostat.target_mode === 'Heat' ? 'secondary' : 'success'}`}
        onClick={() => {
          if (confirm('Switch to Heat mode?'))
            postJson(`${THERMOSTAT_URL}/mode/heat`).then(setThermostat)
        }}
        disabled={thermostat.target_mode === 'Heat' || setterMode}
      >
        Heating
      </button>
      <button
        className={`btn btn-sm btn-${thermostat.target_mode === 'Cool' ? 'secondary' : 'success'}`}
        onClick={() => {
          if (confirm('Swtich to Cool mode?'))
            postJson(`${THERMOSTAT_URL}/mode/cool`).then(setThermostat)
        }}
        disabled={thermostat.target_mode === 'Cool' || setterMode}
      >
        Cooling
      </button>
      <button
        className={`btn btn-sm btn-${thermostat.target_mode === 'Off' ? 'secondary' : 'success'}`}
        onClick={() => {
          if (confirm('Swtich off?')) postJson(`${THERMOSTAT_URL}/mode/off`).then(setThermostat)
        }}
        disabled={thermostat.target_mode === 'Off' || setterMode}
      >
        Off
      </button>
    </div>
  )
}

export default ModeSelector
