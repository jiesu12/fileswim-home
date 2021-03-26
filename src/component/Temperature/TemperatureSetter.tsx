import * as React from 'react'
import { postJson } from '@jiesu12/fileswim-api'
import { THERMOSTAT_URL, Thermostat } from './Temperature'
import { toCelsius, toFahrenheit, renderTemperature } from '../../util/temperatureUtil'
import CheckMark from '../icons/CheckMark'
import Cross from '../icons/Cross'
import UpArrow from '../icons/UpArrow'
import DownArrow from '../icons/DownArrow'
import { isNumberKey, TEMPERATURE_PATTERN } from '../../util/StringUtil'

interface Props {
  celsius: boolean
  thermostat: Thermostat
  setThermostat: (t: Thermostat) => void
  setterMode: boolean
  setSetterMode: (s: boolean) => void
}

const TemperatureSetter = ({
  celsius,
  thermostat,
  setThermostat,
  setSetterMode,
  setterMode,
}: Props) => {
  const [newTemp, setNewTemp] = React.useState<string>(null) // use string to avoid long float number

  const isOffMode = () => {
    return thermostat.current_mode === 'Off'
  }

  const handleInputChange = (e: any) => {
    const value = e.target.value
    if (TEMPERATURE_PATTERN.test(value)) {
      setNewTemp(value)
    } else {
      e.preventDefault()
    }
  }

  return (
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
          <button className='btn btn-sm btn-default cancel' onClick={() => setSetterMode(false)}>
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
          {thermostat.na
            ? ''
            : renderTemperature(
                isOffMode() ? thermostat.current_temperature : thermostat.target_temperature,
                celsius
              )}
        </div>
      )}
    </div>
  )
}

export default TemperatureSetter
