import React from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from './AuthService'

function HomeRedirect() {
  const navigate = useNavigate();
  AuthService.isAuthenticated()
    .then(() => {
      navigate("/overview")
    })
    .catch(error => {
      if (error.response.status === 401) {
        navigate("/login")
      }
    })
  return (
    <div>HomeRedirect</div>
  )
}

export default HomeRedirect