import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'

export default function OrderShow ({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState(0)

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const mslLeft = new Date(order.expiresAt) - new Date()

      setTimeLeft(Math.round(mslLeft / 1000))
    }
    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [order])

  if (timeLeft < 0) {
    return <div>Order expired</div>
  }

  return (
    <div>
     Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51HfbmCAy3n80v3rB1O5ZwAa1JRbMWMcq6kUtUXEdPqhaVTNCZRPACumWAfYJIegMFYoMobPS42qrj2AvWsL0E79f00GD0IWgWq"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query

  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}
