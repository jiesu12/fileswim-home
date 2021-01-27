import { getJson } from '@jiesu12/fileswim-api'
import * as React from 'react'
import { TemperatureStatus } from '../../api/dto'
import './Temperature.scss'

const renderTemperature = (t: any): string => {
  return `${Number.parseFloat(t).toFixed(1)}\u00B0C`
}

const renderHumidity = (h: any): string => {
  return `${Number.parseFloat(h).toFixed(1)}%`
}

const renderTimestamp = (t: number): string => {
  return new Date(t * 1000).toLocaleString()
}

const getTimeClassName = (t: number): string => {
  const hour = new Date(t * 1000).getHours()
  switch (hour) {
    case 20:
    case 21:
    case 22:
    case 23:
      return 'night'
    case 0:
      return 'midnight'
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return 'night'
    case 6:
    case 7:
      return 'dawn'
    case 8:
    case 9:
    case 10:
    case 11:
      return 'day'
    case 12:
      return 'noon'
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
      return 'day'
    case 18:
    case 19:
      return 'dusk'
  }
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
            <tr key={h.timestamp} className={getTimeClassName(h.timestamp)}>
              <td>{renderTimestamp(h.timestamp)}</td>
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
        <div className='dawn'>Dawn</div>
        <div className='day'>Day</div>
        <div className='noon'>Noon</div>
        <div className='dusk'>Dusk</div>
        <div className='night'>Night</div>
        <div className='midnight'>Midnight</div>
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
      <hr />
      <div className='history'>
        <div className='history-control'>
          <button className='btn btn-sm btn-primary' onClick={handleShowHistory}>
            {showHistory ? 'Hide' : 'Show'} History
          </button>
          {showHistory && renderLegend()}
        </div>
        {renderHistory()}
      </div>
    </div>
  )
}

export default Temperature
