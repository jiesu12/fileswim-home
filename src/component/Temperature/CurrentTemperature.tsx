import * as React from 'react'
import { renderTemperature } from '../../util/temperatureUtil'
import { Thermostat } from './Temperature'
import { OFF_MODE } from './ModeSelector'

interface Props {
  thermostat: Thermostat
  celsius: boolean
}

const toPixel = (t: number): number => t * 30

const CurrentTemperature = ({ thermostat, celsius }: Props) => {
  const getTemperatureOffset = (): number => {
    if (thermostat.current_mode === OFF_MODE) {
      return 0
    } else {
      return thermostat.target_temperature - thermostat.current_temperature
    }
  }

  const calcTop = () => {
    let top = 131 + toPixel(getTemperatureOffset())
    // set a limt so it doesn't go out of the bound.
    top = top < 8 ? 8 : top
    top = top > 264 ? 264 : top
    return `${top}px`
  }

  return (
    <div className='status'>
      <div
        className='current-temperature'
        style={{
          top: calcTop(),
        }}
      >
        {renderTemperature(thermostat.current_temperature, celsius)}
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
  )
}

export default CurrentTemperature
