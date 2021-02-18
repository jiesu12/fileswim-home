import { postJson } from '@jiesu12/fileswim-api'
import Modal, { ModalCommands } from '@jiesu12/react-modal'
import * as React from 'react'
import { Thermostat, THERMOSTAT_URL } from './Temperature'

const MODES = ['Cool', 'Heat', 'Off']

interface Props {
  thermostat: Thermostat
  setThermostat: (t: Thermostat) => void
  setterMode: boolean
}

const ModeSelector = ({ thermostat, setThermostat, setterMode }: Props) => {
  const modalCmdRef = React.useRef<ModalCommands>(null)
  const handleSelect = (mode: string) => {
    modalCmdRef.current.confirm(`Swtich to ${mode} mode?`, () => {
      postJson(`${THERMOSTAT_URL}/mode/${mode.toLowerCase()}`).then(setThermostat)
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
          {mode}
        </button>
      ))}
    </div>
  )
}

export default ModeSelector
