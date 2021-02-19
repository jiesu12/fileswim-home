import * as React from 'react'
import { Thermostat } from './Temperature'
import { ModalCommands } from '@jiesu12/react-modal'
import './Settings.scss'

interface Props {
  thermostat: Thermostat
  modalCommands: ModalCommands
  celsius: boolean
}

const Settings = ({ thermostat, modalCommands, celsius }: Props) => {
  const handleOk = () => modalCommands.close()
  return (
    <div className='thermostat-settings'>
      <table className='table'>
        <tbody>
          <tr>
            <td>Over Buffer</td>
            <td>{thermostat.over_buffer_temperature}</td>
          </tr>
          <tr>
            <td>Under Buffer</td>
            <td>{thermostat.under_buffer_temperature}</td>
          </tr>
          <tr>
            <td>Min Run Time</td>
            <td>{thermostat.min_run_time}</td>
          </tr>
          <tr>
            <td>Max Run Time</td>
            <td>{thermostat.max_run_time}</td>
          </tr>
          <tr>
            <td>Min Stop Time</td>
            <td>{thermostat.min_stop_time}</td>
          </tr>
          <tr>
            <td>Alert Time Threshold</td>
            <td>{thermostat.alert_time_threshold}</td>
          </tr>
        </tbody>
      </table>
      <div className='button-panel'>
        <button className='btn btn-sm btn-primary' onClick={handleOk}>
          Ok
        </button>
      </div>
    </div>
  )
}

export default Settings
