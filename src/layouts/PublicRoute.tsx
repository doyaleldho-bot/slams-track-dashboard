import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "../redux/hooks"

const PublicRoute = () => {
  const { initialized, authenticated } = useAppSelector(
    (state) => state.profile,
  )

  const location = useLocation()

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  // Already logged in, don't allow login page
  if (authenticated) {
    const from = location.state?.from || "/"
    console.log(from)
    return <Navigate to={from} replace />
  }

  return <Outlet />
}

export default PublicRoute
