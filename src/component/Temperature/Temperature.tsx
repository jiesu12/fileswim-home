import { getJson } from '@jiesu12/fileswim-api'
import DropdownMenu from '@jiesu12/react-dropdown-menu'
import * as React from 'react'
import { TemperatureStatus, HistoryTotal } from '../../api/dto'
import Operation from '../icons/Operation'
import Stop from '../icons/Stop'
import Timeline from '../Timeline/Timeline'
import CurrentTemperature from './CurrentTemperature'
import ModeSelector, { OFF_MODE } from './ModeSelector'
import './Temperature.scss'
import TemperatureHistory from './TemperatureHistory'
import TemperatureSetter from './TemperatureSetter'
import Modal, { ModalCommands } from '@jiesu12/react-modal'
import Settings from './Settings'
import Scheduler from './Scheduler'
import ScheduleSwitch from './ScheduleSwitch'
import { capitalize } from '../../util/StringUtil'

export const THERMOSTAT_URL = 'https://thermostat.javaswim.com'

export interface Thermostat {
  target_mode: string
  current_mode: string
  target_temperature: number
  current_temperature: number
  current_status: string
  target_status: string
  over_buffer_temperature: number
  under_buffer_temperature: number
  min_run_time: number
  max_run_time: number
  min_stop_time: number
  alert_time_threshold: number
  current_time: number
  room: string
  use_schedule: boolean
  na?: boolean
}

const EMPTY_THERMOSTAT: Thermostat = {
  target_mode: '',
  current_mode: '',
  target_temperature: 20,
  current_temperature: 20,
  current_status: 'stop',
  target_status: 'stop',
  over_buffer_temperature: 0,
  under_buffer_temperature: 0,
  min_run_time: 0,
  max_run_time: 10,
  min_stop_time: 10,
  alert_time_threshold: 600,
  current_time: new Date().getTime(),
  room: '',
  use_schedule: false,
  na: true,
}

type ModalContent = 'Settings' | 'Thermostat History' | 'Temperature History' | 'Schedule'

const Temperature = () => {
  const [history, setHistory] = React.useState<TemperatureStatus[]>([])
  const [totalHistory, setTotalHistory] = React.useState<number>(1)
  const [historyIndex, setHistoryIndex] = React.useState<number>(0)
  const [thermostat, setThermostat] = React.useState<Thermostat>(EMPTY_THERMOSTAT)
  const [thermostatHistory, setThermostHistory] = React.useState<Thermostat[]>([])
  const [celsius, setCelsius] = React.useState<boolean>(false)
  const [setterMode, setSetterMode] = React.useState<boolean>(false)
  const [modalContent, setModalContent] = React.useState<ModalContent>(null)
  const modalCmdRef = React.useRef<ModalCommands>(null)

  React.useEffect(() => {
    retrieveThermostat()
    retrieveTotalHistory()
    const thermostatInterval = setInterval(retrieveThermostat, 2000)
    return () => {
      clearInterval(thermostatInterval)
    }
    // re-create interval when status changes, so that the new status is in retrieveStatus closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const retrieveThermostat = () => {
    getJson(THERMOSTAT_URL)
      .then(setThermostat)
      .catch(() => setThermostat({ ...EMPTY_THERMOSTAT, na: true }))
  }

  const retrieveTotalHistory = () => {
    getJson(`${THERMOSTAT_URL}/history/total`).then((total: HistoryTotal) =>
      setTotalHistory(total.total)
    )
  }

  const retrieveTemperatureHistory = () => {
    getJson('https://temperature.javaswim.com/history').then((text: string) => {
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

  const retrieveThermostatHistory = (resetIndex = false) => {
    const index = resetIndex ? 0 : historyIndex
    if (totalHistory <= index) {
      return
    }
    getJson(`${THERMOSTAT_URL}/history/${index}`).then((h: Thermostat[]) => {
      h.sort((a: Thermostat, b: Thermostat) => b.current_time - a.current_time)
      setThermostHistory([...thermostatHistory, ...h])
    })
    setHistoryIndex(index + 1)
  }

  if (status === null) {
    return null
  }

  const isOffMode = () => {
    return thermostat.current_mode === OFF_MODE
  }

  const renderRunStatus = () => {
    if (isOffMode()) {
      return <Stop />
    } else if (thermostat.current_status === 'run') {
      return <Operation />
    } else {
      return <Stop />
    }
  }

  const renderModalContent = () => {
    if (modalContent === 'Settings') {
      return <Settings thermostat={thermostat} setThermostat={setThermostat} />
    } else if (modalContent === 'Schedule') {
      return <Scheduler celsius={celsius} />
    } else if (modalContent === 'Thermostat History') {
      return (
        <Timeline
          history={thermostatHistory}
          stepNum={4}
          timeProp={'current_time'}
          statusProp={'target_status'}
          statusColorScheme={{ run: 'red', stop: 'gray' }}
          getMoreHistory={retrieveThermostatHistory}
        />
      )
    } else if (modalContent === 'Temperature History') {
      return <TemperatureHistory history={history} celsius={celsius} />
    } else {
      return null
    }
  }

  const renderThermostat = () => {
    return (
      <div className='thermostat'>
        <Modal commandRef={modalCmdRef}>{renderModalContent()}</Modal>
        <DropdownMenu
          title='Menu'
          showTitle={false}
          rightHandSide={false}
          menuItems={[
            {
              key: 'Thermostat History',
              onClick: () => {
                retrieveThermostatHistory(true)
                setModalContent('Thermostat History')
                modalCmdRef.current.modal('Thermostat History')
              },
            },
            {
              key: 'Temperature History',
              onClick: () => {
                retrieveTemperatureHistory()
                setModalContent('Temperature History')
                modalCmdRef.current.modal('Temperature History')
              },
            },
            { key: 'Switch Unit', onClick: () => setCelsius(!celsius) },
            {
              key: 'Schedule',
              onClick: () => {
                setModalContent('Schedule')
                modalCmdRef.current.modal('Schedule')
              },
            },
            {
              key: 'Settings',
              onClick: () => {
                setModalContent('Settings')
                modalCmdRef.current.modal('Settings')
              },
            },
          ]}
        />
        <CurrentTemperature thermostat={thermostat} celsius={celsius} />
        <div className='thermostat-status'>
          <div className='current-mode'>{capitalize(thermostat.current_mode)}</div>
          <div className={`run-status ${thermostat.current_status}`}>{renderRunStatus()}</div>
        </div>
        <TemperatureSetter
          celsius={celsius}
          thermostat={thermostat}
          setThermostat={setThermostat}
          setterMode={setterMode}
          setSetterMode={setSetterMode}
        />
        {thermostat.current_mode !== OFF_MODE && (
          <ScheduleSwitch useSchedule={thermostat.use_schedule} setThermostat={setThermostat} />
        )}
        <ModeSelector
          setterMode={setterMode}
          thermostat={thermostat}
          setThermostat={setThermostat}
        />
        <div className='notification-bar'>
          {thermostat.current_mode === thermostat.target_mode
            ? ''
            : `Will switch to ${thermostat.target_mode} mode after ${thermostat.current_mode} cycle is done.`}
        </div>
      </div>
    )
  }

  return <div className='temperature'>{renderThermostat()}</div>
}

export default Temperature
