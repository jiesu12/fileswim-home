import { getJson, postJson } from '@jiesu12/fileswim-api'
import * as React from 'react'
import { WeeklySchedule } from '../../api/dto'
import CopyEditor from './CopyEditor'
import DailyScheduleBar from './DailyScheduleBar'
import DayTimeLine from './DayTimeLine'
import './Scheduler.scss'
import ScheduleTempTimeEditor from './ScheduleTempTimeEditor'
import { THERMOSTAT_URL } from './Temperature'

export const WeekDayNames: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export interface Editing {
  weekday: number
  secondsOfDay?: number
  temperature?: string
}

const weekDays: number[] = [1, 2, 3, 4, 5, 6, 0]

interface Props {
  celsius: boolean
}

const Scheduler = ({ celsius }: Props) => {
  const [weeklySchedule, setWeeklySchedule] = React.useState<WeeklySchedule>(null)
  const [editing, setEditing] = React.useState<Editing>(null)
  const [copying, setCopying] = React.useState<number>(null)

  React.useEffect(() => {
    getJson(`${THERMOSTAT_URL}/schedules`)
      .then((schedules: WeeklySchedule) => {
        setWeeklySchedule(schedules)
      })
      .catch(() => setWeeklySchedule(null))
  }, [])

  const showTempTimeEditor = (editing: Editing) => {
    setEditing(editing)
  }

  const updateSchedule = (ws: WeeklySchedule) => {
    postJson(`${THERMOSTAT_URL}/schedule`, ws).then((rsp) => setWeeklySchedule(rsp))
  }

  if (editing) {
    return (
      <ScheduleTempTimeEditor
        celsius={celsius}
        close={() => setEditing(null)}
        editing={editing}
        weeklySchedule={weeklySchedule}
        updateSchedule={updateSchedule}
      />
    )
  } else if (copying !== null) {
    return (
      <CopyEditor
        targetWeekday={copying}
        weeklySchedule={weeklySchedule}
        updateSchedule={updateSchedule}
        close={() => setCopying(null)}
      />
    )
  } else {
    return (
      <div className='temperature-scheduler'>
        {weekDays.map((weekday) => (
          <DailyScheduleBar
            celsius={celsius}
            key={weekday}
            weekday={weekday}
            showTempTimeEditor={showTempTimeEditor}
            showCopyEditor={setCopying}
            schedule={weeklySchedule ? weeklySchedule[weekday] : null}
          />
        ))}
        <DayTimeLine />
      </div>
    )
  }
}

export default Scheduler
