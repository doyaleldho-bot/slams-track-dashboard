import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import api from "../api/axios"
import { toast } from "react-toastify"
import { getProfile } from "../redux/action/UserThunk"
import { useAppDispatch } from "../redux/hooks"

const LoginPage = () => {
  const dispatch = useAppDispatch()

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

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
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

    const newErrors = {
      userId: "",
      password: "",
      institution: "",
    }

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
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className=" min-h-screen  flex  flex-col  lg:flex-row  bg-[#f4f7fc] overflow-hidden">
      {/* LEFT LOGIN SECTION */}

      <div className=" relative flex w-full lg:flex-1 min-h-screen items-center justify-center px-4 py-8">
        <div className=" absolute inset-0 bg-[url('/loginBG.png')] bg-cover bg-center opac " />

        <div className=" relative z-10 flex flex-col items-center justify-center w-full ">
          {/* LOGO */}

          <img
            src="/logo1.png"
            alt="Logo"
            className=" h-32 sm:h-40 lg:h-52 object-contain"
          />

          {/* LOGIN CARD */}

          <div className=" w-full max-w-[340px] rounded-md bg-white p-5 sm:p-6 shadow-lg border border-gray-200 ">
            <h2 className=" text-center text-sm font-semibold text-blue-700 mb-5 ">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* USER ID */}

              <div>
                <label className="text-xs font-medium">
                  User ID
                  <span className="text-red-500">*</span>
                </label>

                <input
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  className="mt-1 h-10 w-full rounded-sm  border  border-gray-300 px-3  text-sm outline-none   focus:border-blue-500 "
                />

                {errors.userId && <p>{errors.userId}</p>}
              </div>

              {/* PASSWORD */}

              <div>
                <label className="text-xs font-medium">
                  Password
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className=" mt-1 h-10 w-full rounded-sm border border-gray-300 px-3 pr-10 text-sm outline-none focus:border-blue-500  "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className=" absolute right-2 top-1/2 -translate-y-1/2 text-gray-500  "
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* FORGOT PASSWORD */}

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className=" text-[11px] text-blue-600  "
                >
                  Forgot password?
                </Link>
              </div>

              {/* INSTITUTION */}

              <div>
                <label className="text-xs font-medium">
                  Institution
                  <span className="text-red-500">*</span>
                </label>

                <select
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  className=" mt-1 h-10 w-full rounded-sm border border-gray-300 px-2 text-sm outline-none focus:border-blue-500  "
                >
                  <option value="">Select Institution</option>

                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* LOGIN BUTTON */}

              <button className=" w-full h-10 rounded-sm bg-[#002F96] text-white text-sm hover:bg-[#555] transition ">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT INFORMATION SECTION */}

      <div className=" hidden lg:flex w-full lg:max-w-[45%] relative justify-center overflow-hidden bg-white  ">
        <div className=" absolute inset-0 bg-[url('/loginSideBg.png')] bg-cover bg-center " />

        <div className=" relative z-10 flex flex-col justify-between text-center max-w-lg h-full px-6 xl:px-10 py-8  ">
          <div>
            <p className=" text-sm xl:text-lg text-gray-500 font-semibold leading-relaxed">
              SLAMS Track is an integrated academic and administrative
              management platform designed to simplify and streamline daily
              educational operations.
            </p>

            <p className=" mt-4 text-sm xl:text-lg text-gray-600 font-semibold leading-relaxed">
              It helps institutions efficiently manage student admissions,
              attendance, timetable scheduling, teacher management, payroll, fee
              collections, reports and overall academic activities.
            </p>
          </div>

          <p className=" text-[10px] text-gray-400 mb-4 ">
            Version 1.0 Published on 21-05-2026
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
