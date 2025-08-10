import { useState } from "react"
import { Link } from "react-router-dom"
import { authAPI } from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await authAPI.forgotPassword(email)
      setSent(true)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-neutral-800 bg-neutral-900">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-100 mb-2">
              Check Your Email
            </h1>
            <p className="text-neutral-300 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-neutral-400 mb-6">
              If you don't see the email, check your spam folder.
            </p>
            <Link to="/login">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
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
              <Mail className="h-8 w-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-100 mb-2">
              Reset Password
            </h1>
            <p className="text-neutral-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || !email}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-emerald-400 hover:text-emerald-300 inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
