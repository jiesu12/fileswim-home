import { getJson } from '@jiesu12/fileswim-api'
import * as React from 'react'
import { TemperatureStatus } from '../../api/dto'
import './Temperature.scss'

const Temperature = () => {
  const [status, setStatus] = React.useState<TemperatureStatus>(null)
  React.useEffect(() => {
    retrieveStatus()
    const interval = setInterval(retrieveStatus, 60000)
    return () => clearInterval(interval)
    // re-create interval when status changes, so that the new status is in retrieveStatus closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const retrieveStatus = () => {
    getJson('https://temperature.javaswim.com/temperature').then((s: TemperatureStatus) => {
      if (status === null || status.timestamp !== s.timestamp) {
        setStatus(s)
      }
    })
  }

  if (status === null) {
    return null
  }

  return (
    <div className='temperature'>
      <div className='status'>
        Location: <b>basement</b>
      </div>
      <div className='status'>
        Temperature:{' '}
        <b>
          {Number.parseFloat(status.temperature).toFixed(1)}
          {'\u00B0'}C
        </b>
      </div>
      <div className='status'>
        Humidity: <b>{Number.parseFloat(status.humidity).toFixed(1)}%</b>
      </div>
    </div>
  )
}

export default Temperature
