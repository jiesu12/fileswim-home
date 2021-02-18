import * as React from 'react'
import { TemperatureStatus } from '../../api/dto'
import Timestamp from '../Timestamp/Timestamp'
import { toFahrenheit, renderHumidity } from '../../util/temperatureUtil'

const HISTORY_NUM = 20

const renderTemperature = (degree: number, celsius: boolean): string => {
  if (degree === null) {
    return ''
  }
  return celsius ? `${degree.toFixed(0)}\u00B0C` : `${toFahrenheit(degree).toFixed(0)}\u00B0F`
}

interface Props {
  history: TemperatureStatus[]
  celsius: boolean
}

const TemperatureHistory = ({ history, celsius }: Props) => {
  const [historyNum, setHistoryNum] = React.useState<number>(HISTORY_NUM)
  return (
    <div>
      <table className='table history-table'>
        <thead>
          <tr>
            <th>Time</th>
            <th>Temperature</th>
            <th>Humidity</th>
          </tr>
        </thead>
        <tbody>
          {history.slice(0, historyNum).map((h) => (
            <tr key={h.timestamp}>
              <td>
                <Timestamp timestamp={h.timestamp} />
              </td>
              <td>{renderTemperature(h.temperature, celsius)}</td>
              <td>{renderHumidity(h.humidity)}</td>
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

export default TemperatureHistory
