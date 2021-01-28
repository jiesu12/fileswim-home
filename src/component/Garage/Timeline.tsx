import * as React from 'react'
import { GarageStatus } from '../../api/dto'
import Timestamp from '../Timestamp/Timestamp'
import './Timeline.scss'
import { timePeriodToStr } from '../../util/StringUtil'

const getTimePeriodClass = (mins: number): string => {
  if (mins < 1) {
    return 'super-short'
  } else if (mins < 5) {
    return 'very-short'
  } else if (mins < 10) {
    return 'short'
  } else if (mins < 20) {
    return 'medium'
  } else if (mins < 40) {
    return 'bit-long'
  } else if (mins < 60) {
    return 'long'
  } else if (mins < 120) {
    return 'very-long'
  } else if (mins < 1440) {
    return 'day-long'
  } else if (mins < 10080) {
    return 'week-long'
  } else {
    return 'infinity'
  }
}

interface Props {
  history: GarageStatus[]
  num: number
}

const Timeline = ({ history, num }: Props) => {
  const renderTimePeriod = (status: GarageStatus, nextStatus: GarageStatus) => {
    if (!nextStatus) {
      return (
        <div key={status.timestamp} className='time-period'>
          <Timestamp timestamp={status.timestamp} />
        </div>
      )
    }
    const secs = status.timestamp - nextStatus.timestamp
    const mins = Math.floor(secs / 60)
    const timePeriodClass = getTimePeriodClass(mins)
    return (
      <div
        key={status.timestamp}
        className={`time-period ${timePeriodClass} status-${nextStatus.status}`}
      >
        <Timestamp timestamp={status.timestamp} />
        <div className={`length `}>
          {nextStatus.status} for {timePeriodToStr(secs)}
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return null
  }

  return (
    <div className='timeline'>
      {renderTimePeriod(
        { timestamp: Math.floor(new Date().getTime() / 1000), status: history[0].status },
        history[0]
      )}
      {history.slice(0, num).map((status, index) => renderTimePeriod(status, history[index + 1]))}
    </div>
  )
}

export default Timeline
