import { useState } from 'react'
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'

export default function NewTicket () {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price
    },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = event => {
    event.preventDefault()

    doRequest()
  }

  const onBlur = () => {
    const value = parseFloat(price)

    if (isNaN(value)) {
      return ''
    }

    setPrice(value.toFixed(2))
  }

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input id="title" value={title} onChange={({ target: { value } }) => setTitle(value)} className="form-control"/>
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input onBlur={onBlur} id="price" value={price} onChange={({ target: { value } }) => setPrice(value)} className="form-control"/>
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}
