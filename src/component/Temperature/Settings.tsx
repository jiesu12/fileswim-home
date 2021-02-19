import { postJson } from '@jiesu12/fileswim-api'
import * as React from 'react'
import NumberEditor from '../NumberEditor/NumberEditor'
import './Settings.scss'
import { Thermostat, THERMOSTAT_URL } from './Temperature'

interface Props {
  thermostat: Thermostat
  setThermostat: (thermostat: Thermostat) => void
}

const Settings = ({ thermostat, setThermostat }: Props) => {
  const renderCelsius = (num: number) => `${num}\u00B0C`
  const renderSeconds = (num: number) => `${num} s`
  return (
    <div className='thermostat-settings'>
      <table className='table setting-table'>
        <tbody>
          <tr>
            <td>Over Buffer</td>
            <td>
              <NumberEditor
                num={thermostat.over_buffer_temperature}
                numberPattern={/^\d?$|^\d\.$|^\d\.\d$/}
                renderView={renderCelsius}
                showArrow={false}
                setCb={(num) => {
                  postJson(`${THERMOSTAT_URL}/temperature/overbuffer/${num}`).then((stat) =>
                    setThermostat(stat)
                  )
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Under Buffer</td>
            <td>
              <NumberEditor
                num={thermostat.under_buffer_temperature}
                numberPattern={/^\d?$|^\d\.$|^\d\.\d$/}
                renderView={renderCelsius}
                showArrow={false}
                setCb={(num) => {
                  postJson(`${THERMOSTAT_URL}/temperature/underbuffer/${num}`).then((stat) =>
                    setThermostat(stat)
                  )
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Min Run Time</td>
            <td>
              <NumberEditor
                num={thermostat.min_run_time}
                renderView={renderSeconds}
                showArrow={false}
                setCb={(num) => {
                  postJson(`${THERMOSTAT_URL}/minruntime/${num}`).then((stat) =>
                    setThermostat(stat)
                  )
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Max Run Time</td>
            <td>
              <NumberEditor
                num={thermostat.max_run_time}
                renderView={renderSeconds}
                showArrow={false}
                setCb={(num) => {
                  postJson(`${THERMOSTAT_URL}/maxruntime/${num}`).then((stat) =>
                    setThermostat(stat)
                  )
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Min Stop Time</td>
            <td>
              <NumberEditor
                num={thermostat.min_stop_time}
                renderView={renderSeconds}
                showArrow={false}
                setCb={(num) => {
                  postJson(`${THERMOSTAT_URL}/minstoptime/${num}`).then((stat) =>
                    setThermostat(stat)
                  )
                }}
              />
            </td>
          </tr>
          <tr>
            <td className='left-col'>Alert Time Threshold</td>
            <td>
              <NumberEditor
                num={thermostat.alert_time_threshold}
                renderView={renderSeconds}
                showArrow={false}
                setCb={(num) => {
                  postJson(`${THERMOSTAT_URL}/alerttimethreshold/${num}`).then((stat) =>
                    setThermostat(stat)
                  )
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Settings
