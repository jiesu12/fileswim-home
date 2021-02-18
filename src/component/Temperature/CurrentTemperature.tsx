import * as React from 'react'
import { renderTemperature } from '../../util/temperatureUtil'
import { Thermostat } from './Temperature'

interface Props {
  thermostat: Thermostat
  celsius: boolean
}

const toPixel = (t: number): number => t * 30

const CurrentTemperature = ({ thermostat, celsius }: Props) => {
  const getTemperatureOffset = (): number => {
    if (thermostat.current_mode === 'Off') {
      return 0
    } else {
      return thermostat.target_temperature - thermostat.current_temperature
    }
  }
  return (
    <div className='status'>
      <div
        className='current-temperature'
        style={{
          top: `${131 + toPixel(getTemperatureOffset())}px`,
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
