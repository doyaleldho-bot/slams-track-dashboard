import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Eye, EyeOff, GraduationCap } from "lucide-react"
import api from "../api/axios"
import { toast } from "react-toastify"
import { getProfile } from "../redux/action/UserThunk"
import { useAppDispatch } from "../redux/hooks"

const LoginPage = () => {
  const dispatch = useAppDispatch()
  // const location = useLocation()

  // const redirectPath = location.state?.from || "/"

  const [form, setForm] = useState({
    userId: "",
    password: "",
    institution: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({
    userId: "",
    password: "",
    institution: "",
  })
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  )
  const navigate = useNavigate()

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/list-categories")
        if (response.data.status) {
          setCategories(response.data.categories)
        }
      } catch (error) {
        console.error("Failed to fetch categories", error)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newErrors = { userId: "", password: "", institution: "" }

    if (!form.userId.trim()) newErrors.userId = "User ID is required."
    if (!form.password.trim()) newErrors.password = "Password is required."
    if (!form.institution.trim())
      newErrors.institution = "Select an institution."

    setErrors(newErrors)
    if (newErrors.userId || newErrors.password || newErrors.institution) {
      return
    }

    try {
      const response = await api.post("/login/", {
        user_id: form.userId,
        password: form.password,
        category_id: form.institution,
      })
      // Find selected institution
      const selectedInstitution = categories.find(
        (category) => category.id.toString() === form.institution.toString(),
      )

      localStorage.setItem("institution_name", selectedInstitution?.name || "")
      localStorage.setItem("access_token", response.data.tokens.access)
      localStorage.setItem("refresh_token", response.data.tokens.refresh)
      if (!response.data.status) {
        toast.error(response.data.message)
        return
      }
      await dispatch(getProfile())
      toast.success("Login successful!")

      // const redirectPath = location.state?.from || "/"

      // navigate(redirectPath, {
      //   replace: true,
      // })
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f4f7fc] overflow-hidden">
      {/* LEFT SIDE LOGIN */}
      <div className="relative flex w-full lg:w-1/2 items-center justify-center">
        {/* background waves */}
        <div className="absolute inset-0 bg-[url('/login-bg.png')] bg-cover bg-center opacity-40" />
        <div className="flex flex-col justify-center items-center">
          {/* Logo */}
          <div className="flex justify-center">
            <img src="/logo1.png" className="h-52 object-contain" alt="Logo" />
          </div>
          <div className="relative z-10 w-[340px] rounded-md bg-white p-6 shadow-lg border border-gray-200">
            <h2 className="text-center text-sm font-semibold text-blue-700 mb-5">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User ID */}
              <div>
                <label className="text-xs font-medium">
                  User ID <span className="text-red-500">*</span>
                </label>

                <input
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  className=" mt-1 h-9 w-full rounded-sm border border-gray-300 px-3 text-xs outline-none focus:border-b "
                />

                {errors.userId && (
                  <p className="text-red-500 text-xs mt-1">{errors.userId}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium">
                  Password <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className="mt-1 h-9 w-full rounded-sm border border-gray-300 px-3 pr-8 text-xs outli"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className=" absolute right-2 top-1/2 -translate-y-1/2 text-gra"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-[10px] text-blue-600"
                >
                  forgot password?
                </Link>
              </div>

              {/* Institution */}
              <div>
                <label className="text-xs font-medium">
                  Institution <span className="text-red-500">*</span>
                </label>

                <select
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  className=" mt-1 h-9 w-full rounded-sm border border-gray-300 px-2 text"
                >
                  <option value="">Select Institution</option>

                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <button className=" w-full h-9 rounded-sm bg-[#777] text-white text-xshover:bg-[#555] ">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE INFORMATION */}
      <div className=" hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden bg-white">
        <div className=" absolute inset-0 bg-[url('/login-bg.png')] bg-cover bg-center " />

        <div className=" relative z-10 text-center max-w-md px-10 ">
          <p className=" text-[11px] leading-5 text-gra">
            SLAMS Track is an integrated academic and administrative management
            platform designed to simplify and streamline daily educational
            operations.
          </p>

          <p className=" mt-3 text-[11px] leading-5 text-gray-600 ">
            It helps institutions efficiently manage student admissions,
            attendance, timetable scheduling, teacher management, payroll, fee
            collections, reports and overall academic activities.
          </p>

          <div className=" mt-10 flex justify-center ">
            <div className=" h-44 w-44 rounded-full bg-[#073b9f] flex items-center justify-center ">
              <GraduationCap size={90} className="text-white" />
            </div>
          </div>

          <p className=" mt-8 text-[10px] text-gray-400 ">
            Version 1.0 Published on 21-05-2026
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
