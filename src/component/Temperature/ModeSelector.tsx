import { postJson } from '@jiesu12/fileswim-api'
import Modal, { ModalCommands } from '@jiesu12/react-modal'
import * as React from 'react'
import { Thermostat, THERMOSTAT_URL } from './Temperature'
import { capitalize } from '../../util/StringUtil'

export const OFF_MODE = 'off'
export const HEAT_MODE = 'heat'
export const COOL_MODE = 'cool'

const MODES = [COOL_MODE, HEAT_MODE, OFF_MODE]

interface Props {
  thermostat: Thermostat
  setThermostat: (t: Thermostat) => void
  setterMode: boolean
}

const ModeSelector = ({ thermostat, setThermostat, setterMode }: Props) => {
  const modalCmdRef = React.useRef<ModalCommands>(null)
  const handleSelect = (mode: string) => {
    modalCmdRef.current.confirm(`Switch to ${mode} mode?`, () => {
      postJson(`${THERMOSTAT_URL}/mode/${mode}`).then(setThermostat)
    })
  }
  return (
    <div className='mode-selection'>
      <Modal commandRef={modalCmdRef} />
      {MODES.map((mode: string) => (
        <button
          key={mode}
          className={`btn btn-sm btn-${thermostat.target_mode === mode ? 'secondary' : 'success'}`}
          onClick={() => handleSelect(mode)}
          disabled={thermostat.target_mode === mode || setterMode}
        >
          {capitalize(mode)}
        </button>
      ))}
    </div>
  )
}

export default ModeSelector
