import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, GraduationCap } from "lucide-react"
import api from "../api/axios"
import { toast } from "react-toastify"

const LoginPage = () => {
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

      localStorage.setItem("access_token", response.data.tokens.access)
      localStorage.setItem("refresh_token", response.data.tokens.refresh)
      localStorage.setItem("institution_name", selectedInstitution?.name || "")
      if (!response.data.status) {
        toast.error(response.data.message)
        return
      }

      toast.success("Login successful!")
      navigate("/app")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#e9effb] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.88),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_18%),linear-gradient(180deg,#f7fbff_0%,#e9effb_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-14 h-60 w-96 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1200px] flex-col px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="mx-auto w-full max-w-md rounded-[28px] bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h1 className="mt-6 text-2xl font-semibold text-slate-900">
                Login
              </h1>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  User ID <span className="text-red-500">*</span>
                </label>
                <input
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your user ID"
                />
                {errors.userId && (
                  <p className="mt-2 text-xs text-red-500">{errors.userId}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Institution <span className="text-red-500">*</span>
                </label>
                <select
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Choose an institution</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.institution && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.institution}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-slate-500">Need help?</div>
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>

              <button className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-950">
                Login
              </button>
            </form>
          </div>

          <div className="relative overflow-hidden rounded-[32px] bg-white/95 p-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
            <div className="absolute right-[-30px] top-8 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl" />
            <div className="absolute left-[-24px] bottom-8 h-32 w-32 rounded-full bg-slate-900/5 blur-3xl" />
            <div className="relative z-10 space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                SLAMS Track
              </p>
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Integrated academic and administrative management.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                SLAMS Track is an integrated academic and administrative
                management platform designed to simplify and streamline daily
                educational operations.
              </p>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                It helps institutions efficiently manage student admissions,
                attendance, timetable scheduling, teacher management, payroll,
                fee collections, reports, and overall academic activities from a
                centralized system.
              </p>

              <div className="flex justify-center py-8">
                <div className="flex h-48 w-48 items-center justify-center rounded-full bg-blue-700 shadow-[0_20px_60px_rgba(59,130,246,0.25)]">
                  <GraduationCap className="h-24 w-24 text-white" />
                </div>
              </div>

              <p className="text-center text-xs uppercase tracking-[0.3em] text-slate-400">
                Version 1.0 • Published on 21-05-2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
