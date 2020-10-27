
export default function OrderIndex ({ orders }) {
  return (
    <ul>
      {orders && orders.map(order => (
        <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      ))}
    </ul>
  )
}

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders')

  return { orders: data }
}
