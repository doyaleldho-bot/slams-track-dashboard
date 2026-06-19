import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../api/axios"
import { useAppSelector } from "../redux/hooks"

const ProtectedRoute = () => {
  const { initialized, authenticated } = useAppSelector(
    (state) => state.profile,
  )

  const location = useLocation()

  // const [loading, setLoading] = useState(true)
  // const [authorized, setAuthorized] = useState(false)

  // useEffect(() => {
  //   const verifyAuth = async () => {
  //     const accessToken = localStorage.getItem("access_token")
  //     const refreshToken = localStorage.getItem("refresh_token")

  //     if (accessToken && refreshToken) {
  //       setAuthorized(true)
  //       setLoading(false)
  //       return
  //     }

  //     if (!refreshToken) {
  //       setAuthorized(false)
  //       setLoading(false)
  //       return
  //     }

  //     try {
  //       const res = await api.post("/token-refresh/", {
  //         refresh: refreshToken,
  //       })
  //       localStorage.setItem("access_token", res.data?.tokens?.access)

  //       setAuthorized(true)
  //     } catch (err) {
  //       localStorage.removeItem("access_token")
  //       localStorage.removeItem("refresh_token")
  //       setAuthorized(false)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   verifyAuth()
  // }, [])

  console.log(initialized, authenticated)
  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
