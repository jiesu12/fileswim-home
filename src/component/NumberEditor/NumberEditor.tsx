import * as React from 'react'
import CheckMark from '../icons/CheckMark'
import Cross from '../icons/Cross'
import UpArrow from '../icons/UpArrow'
import DownArrow from '../icons/DownArrow'
import './NumberEditor.scss'

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

interface Props {
  numberPattern?: RegExp
  num: number
  setCb: (num: number) => void
  editMode?: () => void
  viewMode?: () => void
  renderView?: (num: number) => React.ReactNode
  showArrow?: boolean
}

const NumberEditor = ({
  numberPattern = /^\d*$/,
  num,
  setCb,
  editMode = () => null,
  viewMode = () => null,
  renderView = (num: number) => num,
  showArrow = true,
}: Props) => {
  const [newTemp, setNewTemp] = React.useState<number>(null)
  const [editing, setEditing] = React.useState<boolean>(false)

  const handleInputChange = (e: any) => {
    const value = e.target.value
    if (numberPattern.test(value)) {
      setNewTemp(value)
    } else {
      e.preventDefault()
    }
  }
  return (
    <div className='number-editor'>
      {editing ? (
        <div className='edit-mode'>
          <input
            className='form-control'
            type='text'
            onKeyDown={isNumberKey}
            value={newTemp}
            onChange={handleInputChange}
            size={5}
          />
          <button
            className='btn btn-sm btn-default ok'
            onClick={() => {
              setCb(Number(newTemp))
              setEditing(false)
              viewMode()
            }}
          >
            <CheckMark />
          </button>
          <button
            className='btn btn-sm btn-default cancel'
            onClick={() => {
              setEditing(false)
              viewMode()
            }}
          >
            <Cross />
          </button>
          {showArrow && (
            <button className='btn btn-sm btn-default up' onClick={() => setNewTemp(newTemp + 1)}>
              <UpArrow />
            </button>
          )}
          {showArrow && (
            <button className='btn btn-sm btn-default down' onClick={() => setNewTemp(newTemp - 1)}>
              <DownArrow />
            </button>
          )}
        </div>
      ) : (
        <div
          className='view-mode'
          onClick={() => {
            setEditing(true)
            setNewTemp(num)
            editMode()
          }}
        >
          {renderView(num)}
        </div>
      )}
    </div>
  )
}

export default NumberEditor
