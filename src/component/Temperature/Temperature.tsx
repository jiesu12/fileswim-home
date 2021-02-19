import { getJson } from '@jiesu12/fileswim-api'
import DropdownMenu from '@jiesu12/react-dropdown-menu'
import * as React from 'react'
import { TemperatureStatus } from '../../api/dto'
import Operation from '../icons/Operation'
import Stop from '../icons/Stop'
import Timeline from '../Timeline/Timeline'
import CurrentTemperature from './CurrentTemperature'
import ModeSelector from './ModeSelector'
import './Temperature.scss'
import TemperatureHistory from './TemperatureHistory'
import TemperatureSetter from './TemperatureSetter'
import Modal, { ModalCommands } from '@jiesu12/react-modal'
import Settings from './Settings'

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
}

const EMPTY_THERMOSTAT: Thermostat = {
  target_mode: 'Off',
  current_mode: 'Off',
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
}

type ModalContent = 'Settings' | 'Thermostat History' | 'Temperature History'

const Temperature = () => {
  const [history, setHistory] = React.useState<TemperatureStatus[]>([])
  const [thermostat, setThermostat] = React.useState<Thermostat>(EMPTY_THERMOSTAT)
  const [thermostatHistory, setThermostHistory] = React.useState<Thermostat[]>([])
  const [celsius, setCelsius] = React.useState<boolean>(false)
  const [setterMode, setSetterMode] = React.useState<boolean>(false)
  const [modalContent, setModalContent] = React.useState<ModalContent>(null)
  const modalCmdRef = React.useRef<ModalCommands>(null)

  React.useEffect(() => {
    retrieveThermostat()
    const thermostatInterval = setInterval(retrieveThermostat, 2000)
    return () => {
      clearInterval(thermostatInterval)
    }
    // re-create interval when status changes, so that the new status is in retrieveStatus closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const retrieveThermostat = () => {
    getJson(THERMOSTAT_URL).then(setThermostat)
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

  const retrieveThermostatHistory = () => {
    getJson(`${THERMOSTAT_URL}/history`).then((h: Thermostat[]) => {
      h.sort((a: Thermostat, b: Thermostat) => b.current_time - a.current_time)
      setThermostHistory(h)
    })
  }

  if (status === null) {
    return null
  }

  const isOffMode = () => {
    return thermostat.current_mode === 'Off'
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
    } else if (modalContent === 'Thermostat History') {
      return (
        <Timeline
          history={thermostatHistory}
          stepNum={4}
          timeProp={'current_time'}
          statusProp={'target_status'}
          statusColorScheme={{ run: 'red', stop: 'gray' }}
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
                retrieveThermostatHistory()
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
          <div className='current-mode'>{thermostat.current_mode}</div>
          <div className={`run-status ${thermostat.current_status}`}>{renderRunStatus()}</div>
        </div>
        <TemperatureSetter
          celsius={celsius}
          thermostat={thermostat}
          setThermostat={setThermostat}
          setterMode={setterMode}
          setSetterMode={setSetterMode}
        />
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
