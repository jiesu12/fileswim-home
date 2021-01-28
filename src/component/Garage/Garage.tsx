import * as React from 'react'
import { getJson } from '@jiesu12/fileswim-api'
import './Garage.scss'
import { GarageStatus } from '../../api/dto'
import Timestamp from '../Timestamp/Timestamp'

const MINUTE = 60
const HOUR = 60 * 60
const DAY = 60 * 60 * 24
const HISTORY_NUM = 20

const getTimeSince = (timestamp: number): string => {
  const now = new Date().getTime()
  let diff = Math.floor(now / 1000) - timestamp
  const days = Math.floor(diff / DAY)
  diff = diff % DAY
  const hours = Math.floor(diff / HOUR)
  diff = diff % HOUR
  const mins = Math.floor(diff / MINUTE)
  diff = diff % MINUTE
  if (days !== 0) {
    return `${days} days ${hours} hours ${mins} minutes ${diff} seconds`
  } else if (hours !== 0) {
    return `${hours} hours ${mins} minutes ${diff} seconds`
  } else if (mins !== 0) {
    return `${mins} minutes ${diff} seconds`
  } else {
    return `${diff} seconds`
  }
}

const Garage = () => {
  const [status, setStatus] = React.useState<GarageStatus>(null)
  const [history, setHistory] = React.useState<GarageStatus[]>([])
  const [showHistory, setShowHistory] = React.useState<boolean>(false)
  const [historyNum, setHistoryNum] = React.useState<number>(HISTORY_NUM)
  React.useEffect(() => {
    retrieveStatus()
    const interval = setInterval(retrieveStatus, 5000)
    return () => clearInterval(interval)
    // re-create interval when status changes, so that the new status is in retrieveStatus closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const retrieveStatus = () => {
    getJson('https://garage.javaswim.com/status').then((s: GarageStatus) => {
      if (status === null || status.timestamp !== s.timestamp) {
        setStatus(s)
      }
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

  const retrieveHistory = () => {
    getJson('https://garage.javaswim.com/history').then((text: string) => {
      const h =
        '[' +
        text
          .split('\n')
          .filter((l) => l.length !== 0)
          .reverse()
          .join(',') +
        ']'
      const json = JSON.parse(h)
      setHistory(json)
    })
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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.slice(0, historyNum).map((h) => (
            <tr key={h.timestamp}>
              <td>
                <Timestamp timestamp={h.timestamp} />
              </td>
              <td className={`status-${h.status}`}>{h.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  return (
    <div className='garage'>
      <div className='title'>Garage door is</div>
      <div className={`status status-${status.status}`}>{status.status}</div>
      <div>{`for ${getTimeSince(status.timestamp)}`}</div>
      <div className='control-panel'>
        <button className='btn btn-sm btn-primary' onClick={handleShowHistory}>
          {showHistory ? 'Hide' : 'Show'} History
        </button>
      </div>
      {renderHistory()}
      {showHistory && (
        <button
          className='btn btn-sm btn-primary'
          onClick={() => setHistoryNum(historyNum + HISTORY_NUM)}
        >
          Show More
        </button>
      )}
    </div>
  )
}

export default Garage
