import { getJson } from '@jiesu12/fileswim-api'
import * as React from 'react'
import { TemperatureStatus } from '../../api/dto'
import Timestamp from '../Timestamp/Timestamp'
import './Temperature.scss'

const renderTemperature = (t: any): string => {
  return `${Number.parseFloat(t).toFixed(1)}\u00B0C`
}

const renderHumidity = (h: any): string => {
  return `${Number.parseFloat(h).toFixed(1)}%`
}

const Temperature = () => {
  const [status, setStatus] = React.useState<TemperatureStatus>(null)
  const [history, setHistory] = React.useState<TemperatureStatus[]>([])
  const [showHistory, setShowHistory] = React.useState<boolean>(false)
  React.useEffect(() => {
    retrieveStatus()
    const interval = setInterval(retrieveStatus, 60000)
    return () => clearInterval(interval)
    // re-create interval when status changes, so that the new status is in retrieveStatus closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const retrieveStatus = () => {
    getJson('https://temperature.javaswim.com/status').then((s: TemperatureStatus) => {
      if (status === null || status.timestamp !== s.timestamp) {
        setStatus(s)
      }
    })
  }

  const retrieveHistory = () => {
    getJson('https://temperature.javaswim.com/history').then((text: string) => {
      const h =
        '[' +
        text
          .split('\n')
          .filter((l) => l.length !== 0)
          .reverse()
          .slice(0, 50)
          .join(',') +
        ']'
      const json = JSON.parse(h)
      setHistory(json)
    })
  }

  if (status === null) {
    return null
  }

  const handleShowHistory = () => {
    if (!showHistory) {
      retrieveHistory()
    }
    setShowHistory(!showHistory)
  }

  const renderHistory = () => {
    if (!showHistory) {
      return null
    }
    return (
      <table className='table history-table'>
        <thead>
          <tr>
            <th>Time</th>
            <th>Temperature</th>
            <th>Humidity</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h.timestamp}>
              <td>
                <Timestamp timestamp={h.timestamp} />
              </td>
              <td>{renderTemperature(h.temperature)}</td>
              <td>{renderHumidity(h.humidity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const renderLegend = () => {
    return (
      <div className='legend'>
        <div>
          <div className='dawn'>Dawn</div>
          <div className='day'>Day</div>
          <div className='noon'>Noon</div>
          <div className='dusk'>Dusk</div>
          <div className='night'>Night</div>
          <div className='midnight'>Midnight</div>
        </div>
      </div>
    )
  }

  return (
    <div className='temperature'>
      <div className='status'>
        Location: <b>basement</b>
      </div>
      <div className='status'>
        Temperature: <b>{renderTemperature(status.temperature)}</b>
      </div>
      <div className='status'>
        Humidity: <b>{renderHumidity(status.humidity)}</b>
      </div>
      <div className='control-panel'>
        <button className='btn btn-sm btn-primary' onClick={handleShowHistory}>
          {showHistory ? 'Hide' : 'Show'} History
        </button>
      </div>
      {showHistory && renderLegend()}
      {renderHistory()}
    </div>
  )
}

export default Temperature
