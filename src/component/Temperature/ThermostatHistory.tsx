import * as React from 'react'
import { Thermostat } from './Temperature'
import Timestamp from '../Timestamp/Timestamp'
import { renderTemperature } from '../../util/temperatureUtil'

const HISTORY_NUM = 20
interface Props {
  celsius: boolean
  history: Thermostat[]
}

const ThermostatHistory = ({ celsius, history }: Props) => {
  const [historyNum, setHistoryNum] = React.useState<number>(HISTORY_NUM)
  return (
    <div className='thermostat-history'>
      <table className='table thermostat-history-table'>
        <thead>
          <tr>
            <th>Time</th>
            <th>Status</th>
            <th>Current</th>
            <th>Target</th>
          </tr>
        </thead>
        <tbody>
          {history.slice(0, historyNum).map((h) => (
            <tr key={h.current_time.toString()}>
              <td>
                <Timestamp timestamp={h.current_time} />
              </td>
              <td>{h.target_status}</td>
              <td>{renderTemperature(h.current_temperature, celsius)}</td>
              <td>{renderTemperature(h.target_temperature, celsius)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className='btn btn-sm btn-primary'
        onClick={() => setHistoryNum(historyNum + HISTORY_NUM)}
      >
        Show More
      </button>
    </div>
  )
}

export default ThermostatHistory
