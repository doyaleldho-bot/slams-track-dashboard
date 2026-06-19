
// import { Navigate, Outlet } from "react-router-dom";
// import { useEffect, useState } from "react";
// import api from "../api/axios";


// const ProtectedRoute = () => {
//   const [loading, setLoading] = useState(true);
//   const [authorized, setAuthorized] = useState(false);

//   useEffect(() => {
//     const verifyAuth = async () => {

//       const accessToken = localStorage.getItem("access_token");
//       const refreshToken = localStorage.getItem("refresh_token");

//       if (accessToken  && refreshToken) {
//         setAuthorized(true);
//         setLoading(false);
//         return;
//       }

//       if (!refreshToken) {
//         setAuthorized(false);
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await api.post("/token-refresh/", {
//           refresh: refreshToken,
//         });
//         localStorage.setItem("access_token", res.data?.tokens?.access);

//         setAuthorized(true);
//       } catch (err) {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         setAuthorized(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyAuth();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return authorized ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;



import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const accessToken =
    localStorage.getItem("access_token");

  const refreshToken =
    localStorage.getItem("refresh_token");

  return accessToken && refreshToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;