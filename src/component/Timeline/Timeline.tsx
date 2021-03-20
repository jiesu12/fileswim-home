import * as React from 'react'
import { timePeriodToStr } from '../../util/StringUtil'
import Timestamp from '../Timestamp/Timestamp'
import './Timeline.scss'

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

export interface StatusColorScheme {
  [status: string]: string
}

interface Props {
  history: any[]
  stepNum: number
  timeProp: string
  statusProp: string
  statusColorScheme: StatusColorScheme
  getMoreHistory?: () => void
}

const Timeline = ({
  history,
  stepNum,
  timeProp,
  statusProp,
  statusColorScheme,
  getMoreHistory,
}: Props) => {
  const [historyNum, setHistoryNum] = React.useState<number>(stepNum)
  const renderTimePeriod = (status: any, nextStatus: any) => {
    if (!nextStatus) {
      return (
        <div key={status[timeProp]} className='time-period'>
          <Timestamp timestamp={status[timeProp]} />
        </div>
      )
    }
    const secs = Math.floor(status[timeProp] - nextStatus[timeProp])
    const mins = Math.floor(secs / 60)
    const timePeriodClass = getTimePeriodClass(mins)
    return (
      <div key={status[timeProp]} className={`time-period ${timePeriodClass} timeline-status`}>
        <Timestamp timestamp={status[timeProp]} />
        <div
          className='time-period-line'
          style={{ backgroundColor: statusColorScheme[nextStatus[statusProp]] }}
        />
        <div className={`length `}>
          {nextStatus[statusProp]} for {timePeriodToStr(secs)}
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return null
  }

  const handleShowMore = () => {
    const newTotal = historyNum + stepNum
    if (history.length < newTotal && getMoreHistory) {
      getMoreHistory()
    }
    setHistoryNum(newTotal)
  }

  return (
    <div className='timeline'>
      {renderTimePeriod(
        {
          [timeProp]: Math.floor(new Date().getTime() / 1000),
          [statusProp]: history[0][statusProp],
        },
        history[0]
      )}
      {history.slice(0, historyNum).map((h, index) => renderTimePeriod(h, history[index + 1]))}
      {
        <button className='btn btn-sm btn-primary' onClick={handleShowMore}>
          Show More
        </button>
      }
    </div>
  )
}

export default Timeline
