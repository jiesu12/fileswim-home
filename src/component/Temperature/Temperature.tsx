import { getJson } from '@jiesu12/fileswim-api'
import DropdownMenu from '@jiesu12/react-dropdown-menu'
import * as React from 'react'
import { TemperatureStatus } from '../../api/dto'
import Operation from '../icons/Operation'
import Stop from '../icons/Stop'
import CurrentTemperature from './CurrentTemperature'
import ModeSelector from './ModeSelector'
import './Temperature.scss'
import TemperatureHistory from './TemperatureHistory'
import TemperatureSetter from './TemperatureSetter'
import ThermostatHistory from './ThermostatHistory'
import Timeline from '../Timeline/Timeline'

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
  current_time: new Date().getTime(),
  room: '',
}

const Temperature = () => {
  const [history, setHistory] = React.useState<TemperatureStatus[]>([])
  const [showTemperatureHistory, setShowTemperatureHistory] = React.useState<boolean>(false)
  const [showThermostatHistory, setShowThermostatHistory] = React.useState<boolean>(false)
  const [thermostat, setThermostat] = React.useState<Thermostat>(EMPTY_THERMOSTAT)
  const [thermostatHistory, setThermostHistory] = React.useState<Thermostat[]>([])
  const [celsius, setCelsius] = React.useState<boolean>(false)
  const [setterMode, setSetterMode] = React.useState<boolean>(false)

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

  const handleShowTemperatureHistory = () => {
    if (!showTemperatureHistory) {
      retrieveTemperatureHistory()
      setShowThermostatHistory(false)
    }
    setShowTemperatureHistory(!showTemperatureHistory)
  }

  const handleShowThermostatHistory = () => {
    if (!showThermostatHistory) {
      retrieveThermostatHistory()
      setShowTemperatureHistory(false)
    }
    setShowThermostatHistory(!showThermostatHistory)
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

  const renderThermostat = () => {
    return (
      <div className='thermostat'>
        <DropdownMenu
          title='Menu'
          showTitle={false}
          rightHandSide={false}
          menuItems={[
            { key: 'Temperature History', onClick: handleShowTemperatureHistory },
            { key: 'Thermostat History', onClick: handleShowThermostatHistory },
            { key: 'Switch Unit', onClick: () => setCelsius(!celsius) },
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

  return (
    <div className='temperature'>
      {renderThermostat()}
      {showTemperatureHistory && <TemperatureHistory history={history} celsius={celsius} />}
      {showThermostatHistory && (
        <Timeline
          history={thermostatHistory}
          stepNum={4}
          timeProp={'current_time'}
          statusProp={'target_status'}
          statusColorScheme={{ run: 'red', stop: 'blue' }}
        />
      )}
    </div>
  )
}

export default Temperature
