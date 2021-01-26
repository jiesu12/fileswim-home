import * as React from 'react'
import { getJson } from '@jiesu12/fileswim-api'
import './Garage.scss'
import { GarageStatus } from '../../api/dto'

const MINUTE = 60
const HOUR = 60 * 60
const DAY = 60 * 60 * 24

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
  React.useEffect(() => {
    retrieveStatus()
    const interval = setInterval(retrieveStatus, 2000)
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

  return (
    <div className='garage'>
      <div className='title'>Garage door is</div>
      <div className={`status status-${status.status}`}>{status.status}</div>
      <div>{`for ${getTimeSince(status.timestamp)}`}</div>
    </div>
  )
}

export default Garage
