import { getJson, postJson } from '@jiesu12/fileswim-api'
import DropdownMenu from '@jiesu12/react-dropdown-menu'
import * as React from 'react'
import { GarageStatus, GarageAlertStatus } from '../../api/dto'
import './Garage.scss'
import Timeline from '../Timeline/Timeline'
import Modal, { ModalCommands } from '@jiesu12/react-modal'

const Garage = () => {
  const [status, setStatus] = React.useState<GarageStatus>(null)
  const [alertStatus, setAlertStatus] = React.useState<GarageAlertStatus>(null)
  const [history, setHistory] = React.useState<GarageStatus[]>([])
  const [showCam, setShowCam] = React.useState<boolean>(false)
  const modalCmdRef = React.useRef<ModalCommands>(null)

  React.useEffect(() => {
    retrieveStatus()
    retrieveAlertStatus()
    const interval = setInterval(retrieveStatus, 5000)
    return () => clearInterval(interval)
    // re-create interval when status changes, so that the new status is in retrieveStatus closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const retrieveStatus = () => {
    getJson('https://garage.javaswim.com/status').then((s: GarageStatus) => {
      if (status === null || status.timestamp !== s.timestamp) {
        setStatus(s)
      }
    })
  }

  const retrieveAlertStatus = () => {
    getJson('https://garage.javaswim.com/alert').then((s: GarageAlertStatus) => {
      setAlertStatus(s)
    })
  }

  if (status === null) {
    return null
  }

  const handleShowCam = () => {
    setShowCam(!showCam)
  }

  const handleAlert = () => {
    postJson('https://garage.javaswim.com/alert').then((a: GarageAlertStatus) => setAlertStatus(a))
  }

  const handleDoorSwitch = () => {
    modalCmdRef.current.confirm('Press Garage Door Button?', () => {
      postJson('https://garage.javaswim.com/doorswitch')
    })
  }

  const renderCam = () => {
    return (
      <div className='cam-div'>
        <img src='https://cam2.javaswim.com/stream' alt='image' />
      </div>
    )
  }

  const retrieveHistory = () => {
    getJson('https://garage.javaswim.com/history').then((text: string) => {
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

  return (
    <div className='garage'>
      <Modal commandRef={modalCmdRef}>
        <Timeline
          history={history}
          stepNum={4}
          timeProp={'timestamp'}
          statusProp={'status'}
          statusColorScheme={{ open: 'red', close: 'gray' }}
        />
      </Modal>
      <DropdownMenu
        title='Menu'
        showTitle={false}
        rightHandSide={false}
        menuItems={[
          {
            key: 'History',
            onClick: () => {
              retrieveHistory()
              modalCmdRef.current.modal('Garage Door History')
            },
          },
          { key: 'Camera', onClick: handleShowCam },
          {
            key: 'Recordings',
            display: (
              <a className='menu-item' href='/fileswim/filemanager?instance=camera&path=garage.lan'>
                Recordings
              </a>
            ),
            onClick: null,
          },
          { key: 'Alert', onClick: handleAlert },
        ]}
      />
      <div className='title'>Garage door is</div>
      <div className='status-panel'>
        <div className={`status status-${status.status}`}>{status.status}</div>
      </div>
      <div className='control-panel'>
        <button className='btn btn-danger btn-sm door-switch' onClick={handleDoorSwitch}>
          Door Button
        </button>
      </div>
      {alertStatus && <div>{`Alert is ${alertStatus.alert ? 'On' : 'Off'}`}</div>}
      {showCam && renderCam()}
    </div>
  )
}

export default Garage
