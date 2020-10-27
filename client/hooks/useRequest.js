import axios from 'axios'
import { useState } from 'react'

export default function useRequest ({ url, method, body, onSuccess }) {
  const [errors, setErrors] = useState(null)

  const doRequest = async (props = {}) => {
    try {
      setErrors(null)
      const { data } = await axios[method](url, { ...body, ...props })
      if (onSuccess) {
        onSuccess(data)
      }
      return data
    } catch (error) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Oooops...</h4>
          <ul className="my-0">
            { error.response.data.errors.map(err => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>

        </div>
      )
    }
  }
  return { doRequest, errors }
}
