import { Outlet, Navigate } from 'react-router-dom'
import AuthService from './AuthService'

const ProtectedRoutes = () => {
    let token = AuthService.isAuthenticated()

    return (
        token ? <Outlet /> : <Navigate to="/login" />
    )
}

export default ProtectedRoutes