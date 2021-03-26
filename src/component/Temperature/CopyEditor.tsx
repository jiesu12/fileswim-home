import * as React from 'react'
import { WeeklySchedule } from '../../api/dto'

interface Props {
  targetWeekday: number
  weeklySchedule: WeeklySchedule
  close: () => void
  updateSchedule: (weeklySchedule: WeeklySchedule) => void
}

const CopyEditor = ({ targetWeekday, weeklySchedule, close, updateSchedule }: Props) => {
  const sourceRef = React.useRef(null)
  const handleCopy = () => {
    const source = Number(sourceRef.current.value)
    const updated = weeklySchedule ? [...weeklySchedule] : []
    updated[targetWeekday] = [...updated[source]]
    close()
    updateSchedule(updated)
  }

  return (
    <div className='schedule-copy-editor'>
      <div>
        <input ref={sourceRef} />
      </div>
      <div className='btn-panel'>
        <button onClick={handleCopy}>Copy</button>
        <button onClick={close}>Cancel</button>
      </div>
    </div>
  )
}

export default CopyEditor
