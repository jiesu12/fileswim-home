import { getJson, postJson } from '@jiesu12/fileswim-api'
import * as React from 'react'
import { TemperatureStatus } from '../../api/dto'
import Timestamp from '../Timestamp/Timestamp'
import DropdownMenu from '@jiesu12/react-dropdown-menu'
import './Temperature.scss'

const HISTORY_NUM = 20
const THERMOSTAT_URL = 'https://thermostat.javaswim.com'

const toFahrenheit = (celsius: number) => {
  return (celsius * 9) / 5 + 32
}

const renderTemperature = (t: any): string => {
  if (t === null) {
    return ''
  }
  return `${toFahrenheit(t).toFixed(1)}\u00B0F(${Number(t).toFixed(1)}\u00B0C)`
}

const renderHumidity = (h: any): string => {
  return `${Number.parseFloat(h).toFixed(1)}%`
}

interface Thermostat {
  target_mode: string
  current_mode: string
  target_temperature: number
  current_temperature: number
  current_status: string
  target_status: string
}

const Temperature = () => {
  const [status, setStatus] = React.useState<TemperatureStatus>(null)
  const [history, setHistory] = React.useState<TemperatureStatus[]>([])
  const [showHistory, setShowHistory] = React.useState<boolean>(false)
  const [historyNum, setHistoryNum] = React.useState<number>(HISTORY_NUM)
  const [thermostat, setThermostat] = React.useState<Thermostat>(null)
  const [setterMode, setSetterMode] = React.useState<boolean>(false)
  const [newTemp, setNewTemp] = React.useState<number>(null)

  React.useEffect(() => {
    retrieveTemperature()
    retrieveThermostat()
    const temperatureInterval = setInterval(retrieveTemperature, 30000)
    const thermostatInterval = setInterval(retrieveThermostat, 2000)
    return () => {
      clearInterval(temperatureInterval)
      clearInterval(thermostatInterval)
    }
    // re-create interval when status changes, so that the new status is in retrieveStatus closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const retrieveTemperature = () => {
    getJson('https://temperature.javaswim.com/status').then((s: TemperatureStatus) => {
      if (status === null || status.timestamp !== s.timestamp) {
        setStatus(s)
      }
    })
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

  const isOffMode = () => {
    return thermostat.current_mode === 'Off'
  }

  const renderThermostat = () => {
    return (
      <div className='thermostat'>
        <div className='thermostat-status'>
          <div className='current-mode'>
            {`${thermostat.current_mode} ${isOffMode() ? '' : ' On'}`}
          </div>
          <div className='run-status'>{isOffMode() ? '' : thermostat.current_status}</div>
        </div>
        <div className='temperature-setter'>
          {setterMode ? (
            <div>
              <input
                type='text'
                pattern='[0-9]{0,2}[\.]?[0-9]{0,2}'
                onKeyDown={isNumberKey}
                value={newTemp}
                onChange={(e: any) => setNewTemp(e.target.value)}
                size={8}
              />
              <button
                className='btn btn-sm btn-primary'
                onClick={() => {
                  postJson(`${THERMOSTAT_URL}/temperature/${newTemp}`).then(setThermostat)
                  setSetterMode(false)
                }}
              >
                Set Temperature
              </button>
            </div>
          ) : (
            <div
              className='target-temperature'
              onClick={() => {
                setSetterMode(true)
                setNewTemp(thermostat.target_temperature)
              }}
            >
              {isOffMode() ? '' : renderTemperature(thermostat.target_temperature)}
            </div>
          )}
        </div>
        <div className='mode-selection'>
          <button
            className={`btn btn-sm btn-${
              thermostat.current_mode === 'Heat' ? 'secondary' : 'success'
            }`}
            onClick={() => postJson(`${THERMOSTAT_URL}/mode/heat`).then(setThermostat)}
            disabled={thermostat.current_mode === 'Heat'}
          >
            Heating
          </button>
          <button
            className={`btn btn-sm btn-${
              thermostat.current_mode === 'Cool' ? 'secondary' : 'success'
            }`}
            onClick={() => postJson(`${THERMOSTAT_URL}/mode/cool`).then(setThermostat)}
            disabled={thermostat.current_mode === 'Cool'}
          >
            Cooling
          </button>
          <button
            className={`btn btn-sm btn-${
              thermostat.current_mode === 'Off' ? 'secondary' : 'success'
            }`}
            onClick={() => postJson(`${THERMOSTAT_URL}/mode/off`).then(setThermostat)}
            disabled={thermostat.current_mode === 'Off'}
          >
            Off
          </button>
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
      <DropdownMenu
        title='Menu'
        showTitle={false}
        rightHandSide={false}
        menuItems={[{ key: 'History', onClick: handleShowHistory }]}
      />
      <div className='status'>
        <div className='current-temperature'>{renderTemperature(status.temperature)}</div>
        <div className='current-humidity'>{renderHumidity(status.humidity)}</div>
      </div>
      {thermostat && renderThermostat()}
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
