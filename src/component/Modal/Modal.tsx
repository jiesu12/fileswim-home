import * as React from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../../action/modal'
import { RootState } from '../../reducer'
import './Modal.scss'

const Modal = (): React.ReactElement => {
  const dispatch = useDispatch()
  const { modal, show } = useSelector((state: RootState) => state.modal)
  const handleClick = useCallback(() => {
    dispatch(closeModal())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`modal-panel ${show ? 'show' : 'hide'}`}>
      <div className='content'>
        <div className='title-bar'>
          <h4 className='title'>{modal && modal.title}</h4>
          <button className='btn btn-outline-primary close-btn' onClick={handleClick}>
            X
          </button>
        </div>
        <div className='child-component'>{modal && modal.child}</div>
      </div>
    </div>
  )
}

export default Modal
