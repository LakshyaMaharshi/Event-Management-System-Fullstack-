import { CheckCircle, Clock, XCircle, AlertCircle, Zap } from "lucide-react"

export default function StatusBadge({ status, size = "sm" }) {
  const s = (status || "pending").toLowerCase()
  
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }
  
  const base = `inline-flex items-center rounded-full border font-medium transition-all ${sizeClasses[size]}`
  
  const configs = {
    approved: {
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
      label: "Approved"
    },
    completed: {
      className: "border-emerald-600/30 bg-emerald-600/10 text-emerald-400",
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
      label: "Completed"
    },
    rejected: {
      className: "border-red-500/30 bg-red-500/10 text-red-300",
      icon: <XCircle className="w-3 h-3 mr-1" />,
      label: "Rejected"
    },
    denied: {
      className: "border-red-500/30 bg-red-500/10 text-red-300",
      icon: <XCircle className="w-3 h-3 mr-1" />,
      label: "Denied"
    },
    pending: {
      className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      icon: <Clock className="w-3 h-3 mr-1" />,
      label: "Pending"
    },
    urgent: {
      className: "border-red-400/30 bg-red-400/10 text-red-200",
      icon: <Zap className="w-3 h-3 mr-1" />,
      label: "Urgent"
    },
    "needs-revision": {
      className: "border-purple-500/30 bg-purple-500/10 text-purple-300",
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
      label: "Needs Revision"
    }
  }
  
  const config = configs[s] || configs.pending
  
  return (
    <span className={`${base} ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const p = (priority || "medium").toLowerCase()
  
  const configs = {
    urgent: {
      className: "border-red-500/30 bg-red-500/20 text-red-200",
      icon: <Zap className="w-3 h-3 mr-1" />,
      label: "Urgent"
    },
    high: {
      className: "border-orange-500/30 bg-orange-500/20 text-orange-200",
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
      label: "High"
    },
    medium: {
      className: "border-blue-500/30 bg-blue-500/20 text-blue-200",
      label: "Medium"
    },
    low: {
      className: "border-gray-500/30 bg-gray-500/20 text-gray-300",
      label: "Low"
    }
  }
  
  const config = configs[p] || configs.medium
  
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  )
}
