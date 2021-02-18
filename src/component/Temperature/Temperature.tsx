import { getJson, postJson } from '@jiesu12/fileswim-api'
import DropdownMenu from '@jiesu12/react-dropdown-menu'
import * as React from 'react'
import { TemperatureStatus } from '../../api/dto'
import CheckMark from '../icons/CheckMark'
import Cross from '../icons/Cross'
import DownArrow from '../icons/DownArrow'
import Operation from '../icons/Operation'
import Stop from '../icons/Stop'
import UpArrow from '../icons/UpArrow'
import Timestamp from '../Timestamp/Timestamp'
import './Temperature.scss'

const HISTORY_NUM = 20
const THERMOSTAT_URL = 'https://thermostat.javaswim.com'
const TEMPERATURE_PATTERN = /^\d{0,2}$/

const toFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32
}

const toCelsius = (fahrenheit: number): number => {
  return ((fahrenheit - 32) * 5) / 9
}

const renderHumidity = (h: number): string => {
  return `${h.toFixed(1)}%`
}

interface Thermostat {
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
  const [showHistory, setShowHistory] = React.useState<boolean>(false)
  const [historyNum, setHistoryNum] = React.useState<number>(HISTORY_NUM)
  const [thermostat, setThermostat] = React.useState<Thermostat>(EMPTY_THERMOSTAT)
  const [setterMode, setSetterMode] = React.useState<boolean>(false)
  const [newTemp, setNewTemp] = React.useState<string>(null) // use string to avoid long float number
  const [celsius, setCelsius] = React.useState<boolean>(false)

  React.useEffect(() => {
    retrieveThermostat()
    const thermostatInterval = setInterval(retrieveThermostat, 2000)
    return () => {
      clearInterval(thermostatInterval)
    }
    // re-create interval when status changes, so that the new status is in retrieveStatus closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const renderTemperature = (degree: number): string => {
    if (degree === null) {
      return ''
    }
    return celsius ? `${degree.toFixed(0)}\u00B0C` : `${toFahrenheit(degree).toFixed(0)}\u00B0F`
  }

  const retrieveThermostat = () => {
    getJson(THERMOSTAT_URL).then(setThermostat)
  }

  const retrieveHistory = () => {
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

  if (status === null) {
    return null
  }

  const handleShowHistory = () => {
    if (!showHistory) {
      retrieveHistory()
    }
    setShowHistory(!showHistory)
  }

  const isNumberKey = (evt: any) => {
    const charCode = evt.which ? evt.which : evt.keyCode
    if (
      charCode != 190 &&
      charCode != 37 &&
      charCode != 39 &&
      charCode != 8 &&
      (charCode < 48 || charCode > 57)
    ) {
      evt.preventDefault()
    }
  }

  const handleInputChange = (e: any) => {
    const value = e.target.value
    if (TEMPERATURE_PATTERN.test(value)) {
      setNewTemp(value)
    } else {
      e.preventDefault()
    }
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

  const getTemperatureOffset = (): number => {
    if (isOffMode()) {
      return 0
    } else {
      return thermostat.target_temperature - thermostat.current_temperature
    }
  }

  const toPixel = (t: number): number => t * 30

  const renderThermostat = () => {
    return (
      <div className='thermostat'>
        <DropdownMenu
          title='Menu'
          showTitle={false}
          rightHandSide={false}
          menuItems={[
            { key: 'Temperature History', onClick: handleShowHistory },
            { key: 'Switch Unit', onClick: () => setCelsius(!celsius) },
          ]}
        />
        <div className='status'>
          <div
            className='current-temperature'
            style={{
              top: `${131 + toPixel(getTemperatureOffset())}px`,
            }}
          >
            {renderTemperature(thermostat.current_temperature)}
            <span className='room'>{thermostat.room}</span>
          </div>
          <div className='temperature-line temperature-solid-line' />
          <div
            className='temperature-line temperature-buffer-line'
            style={{
              top: `${149 - toPixel(thermostat.over_buffer_temperature)}px`,
              height: `${toPixel(
                thermostat.over_buffer_temperature + thermostat.under_buffer_temperature
              )}px`,
            }}
          />
          <div className='target-temperature-pointer' />
        </div>
        <div className='thermostat-status'>
          <div className='current-mode'>
            {`${thermostat.current_mode} ${isOffMode() ? '' : ' On'}`}
          </div>
          <div className={`run-status ${thermostat.current_status}`}>{renderRunStatus()}</div>
        </div>
        <div className='temperature-setter'>
          {setterMode ? (
            <div className='setter-view'>
              <input
                className='form-control temperature-input'
                type='text'
                onKeyDown={isNumberKey}
                value={newTemp}
                onChange={handleInputChange}
                size={5}
              />
              <button
                className='btn btn-sm btn-default ok'
                onClick={() => {
                  const t = celsius ? Number(newTemp) : toCelsius(Number(newTemp))
                  postJson(`${THERMOSTAT_URL}/temperature/${t.toFixed(1)}`).then(setThermostat)
                  setSetterMode(false)
                }}
              >
                <CheckMark />
              </button>
              <button
                className='btn btn-sm btn-default cancel'
                onClick={() => setSetterMode(false)}
              >
                <Cross />
              </button>
              <button
                className='btn btn-sm btn-default up'
                onClick={() => setNewTemp((Number(newTemp) + 1).toString())}
              >
                <UpArrow />
              </button>
              <button
                className='btn btn-sm btn-default down'
                onClick={() => setNewTemp((Number(newTemp) - 1).toString())}
              >
                <DownArrow />
              </button>
            </div>
          ) : (
            <div
              className={`target-temperature ${isOffMode() ? 'off' : ''}`}
              onClick={() => {
                if (!isOffMode()) {
                  setSetterMode(true)
                  setNewTemp(
                    celsius
                      ? thermostat.target_temperature.toFixed(0)
                      : toFahrenheit(thermostat.target_temperature).toFixed(0)
                  )
                }
              }}
            >
              {renderTemperature(
                isOffMode() ? thermostat.current_temperature : thermostat.target_temperature
              )}
            </div>
          )}
        </div>
        <div className='mode-selection'>
          <button
            className={`btn btn-sm btn-${
              thermostat.target_mode === 'Heat' ? 'secondary' : 'success'
            }`}
            onClick={() => {
              if (confirm('Switch to Heat mode?'))
                postJson(`${THERMOSTAT_URL}/mode/heat`).then(setThermostat)
            }}
            disabled={thermostat.target_mode === 'Heat' || setterMode}
          >
            Heating
          </button>
          <button
            className={`btn btn-sm btn-${
              thermostat.target_mode === 'Cool' ? 'secondary' : 'success'
            }`}
            onClick={() => {
              if (confirm('Swtich to Cool mode?'))
                postJson(`${THERMOSTAT_URL}/mode/cool`).then(setThermostat)
            }}
            disabled={thermostat.target_mode === 'Cool' || setterMode}
          >
            Cooling
          </button>
          <button
            className={`btn btn-sm btn-${
              thermostat.target_mode === 'Off' ? 'secondary' : 'success'
            }`}
            onClick={() => {
              if (confirm('Swtich off?')) postJson(`${THERMOSTAT_URL}/mode/off`).then(setThermostat)
            }}
            disabled={thermostat.target_mode === 'Off' || setterMode}
          >
            Off
          </button>
        </div>
        <div className='notification-bar'>
          {thermostat.current_mode === thermostat.target_mode
            ? ''
            : `Will switch to ${thermostat.target_mode} mode after ${thermostat.current_mode} cycle is done.`}
        </div>
      </div>
    )
  }

  const renderHistory = () => {
    if (!showHistory) {
      return null
    }
    return (
      <table className='table history-table'>
        <thead>
          <tr>
            <th>Time</th>
            <th>Temperature</th>
            <th>Humidity</th>
          </tr>
        </thead>
        <tbody>
          {history.slice(0, historyNum).map((h) => (
            <tr key={h.timestamp}>
              <td>
                <Timestamp timestamp={h.timestamp} />
              </td>
              <td>{renderTemperature(h.temperature)}</td>
              <td>{renderHumidity(h.humidity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className='temperature'>
      {renderThermostat()}
      {renderHistory()}
      {showHistory && (
        <button
          className='btn btn-sm btn-primary'
          onClick={() => setHistoryNum(historyNum + HISTORY_NUM)}
        >
          Show More
        </button>
      )}
    </div>
  )
}

export default Temperature
