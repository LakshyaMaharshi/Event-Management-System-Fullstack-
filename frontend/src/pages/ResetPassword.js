import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { authAPI } from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react"

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setError("Invalid reset token")
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)

    try {
      await authAPI.resetPassword(token, password)
      setSuccess(true)
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-neutral-800 bg-neutral-900">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-100 mb-2">
              Password Reset Successful
            </h1>
            <p className="text-neutral-300 mb-6">
              Your password has been reset successfully. Redirecting to login...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-neutral-800 bg-neutral-900">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-full mb-4">
              <Lock className="h-8 w-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-100 mb-2">
              Set New Password
            </h1>
            <p className="text-neutral-400">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 pr-10 border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || !password || !confirmPassword || !token}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
