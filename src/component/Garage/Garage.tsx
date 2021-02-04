import { getJson, postJson } from '@jiesu12/fileswim-api'
import * as React from 'react'
import { GarageStatus } from '../../api/dto'
import './Garage.scss'
import Timeline from './Timeline'

const HISTORY_NUM = 4

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

  const handleDoorSwitch = () => {
    postJson('https://garage.javaswim.com/doorswitch')
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
    return <Timeline history={history} num={historyNum} />
  }
  return (
    <div className='garage'>
      <div className='title'>Garage door is</div>
      <div className='status-panel'>
        <div className={`status status-${status.status}`}>{status.status}</div>
        <button className='btn btn-sm btn-link history-btn' onClick={handleShowHistory}>
          {showHistory ? 'Hide' : 'Show'} History
        </button>
      </div>
      <div className='control-panel'>
        <button className='btn btn-danger btn-sm door-switch' onClick={handleDoorSwitch}>
          Door Button
        </button>
      </div>
      {renderHistory()}
      {showHistory && (
        <button
          className='btn btn-sm btn-outline-primary'
          onClick={() => setHistoryNum(historyNum + HISTORY_NUM)}
        >
          Show More
        </button>
      )}
    </div>
  )
}

export default Garage
