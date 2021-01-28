import * as React from 'react'
import './Timestamp.scss'

const timestampToStr = (date: Date): string => {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

interface Props {
  timestamp: number
}

const Timestamp = ({ timestamp }: Props) => {
  const date = new Date(timestamp * 1000)
  const hour = date.getHours()
  return <div className={`timestamp hour${hour}`}>{timestampToStr(date)}</div>
}

export default Timestamp
