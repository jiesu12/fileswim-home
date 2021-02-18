import { postJson } from '@jiesu12/fileswim-api'
import * as React from 'react'
import { Thermostat, THERMOSTAT_URL } from './Temperature'

const MODES = ['Cool', 'Heat', 'Off']

interface Props {
  thermostat: Thermostat
  setThermostat: (t: Thermostat) => void
  setterMode: boolean
}

const ModeSelector = ({ thermostat, setThermostat, setterMode }: Props) => {
  return (
    <div className='mode-selection'>
      {MODES.map((mode: string) => (
        <button
          key={mode}
          className={`btn btn-sm btn-${thermostat.target_mode === mode ? 'secondary' : 'success'}`}
          onClick={() => {
            if (confirm(`Swtich to ${mode} mode?`))
              postJson(`${THERMOSTAT_URL}/mode/${mode.toLowerCase()}`).then(setThermostat)
          }}
          disabled={thermostat.target_mode === mode || setterMode}
        >
          {mode}
        </button>
      ))}
    </div>
  )
}

export default ModeSelector
