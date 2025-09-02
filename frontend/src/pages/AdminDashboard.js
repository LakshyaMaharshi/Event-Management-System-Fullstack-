"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { adminAPI } from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import StatusBadge, { PriorityBadge } from "../components/status-badge"
import { 
  Calendar, Clock, MapPin, Users, BarChart3, ClipboardList,
  CheckCircle2 as CheckCircle, XCircle as X, XCircle,
  Zap, Eye, TrendingUp, Award, AlertTriangle,
  Check, Tag
} from "lucide-react"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("pending") // 'pending' | 'all' | 'analytics' | 'denied'
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    fetchData()

  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === "pending") {
        const response = await adminAPI.getPendingEvents()
        setEvents(response?.data?.data || [])
      } else if (activeTab === "denied") {
        const response = await adminAPI.getAllEvents()
        const deniedEvents = response?.data?.data?.filter(event => event.status === 'denied') || []
        setEvents(deniedEvents)
      } else if (activeTab === "all") {
        const response = await adminAPI.getAllEvents()
        setEvents(response?.data?.data || [])
      } else if (activeTab === "analytics") {
        const response = await adminAPI.getAnalytics()
        setAnalytics(response?.data?.data || null)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (eventId) => {
    const notes = window.prompt("Enter approval notes (optional):")
    try {
      await adminAPI.approveEvent(eventId, notes || "")
      alert("Event approved successfully!")
      fetchData()
    } catch (error) {
      console.error("Failed to approve event:", error)
      alert("Failed to approve event. Please try again.")
    }
  }

  const handleDeny = async (eventId) => {
    const reason = window.prompt("Enter reason for denial:")
    if (!reason) return
    try {
      await adminAPI.denyEvent(eventId, reason)
      alert("Event denied successfully!")
      fetchData()
    } catch (error) {
      console.error("Failed to deny event:", error)
      alert("Failed to deny event. Please try again.")
    }
  }

  const handleComplete = async (eventId) => {
    if (window.confirm("Mark this event as completed?")) {
      try {
        await adminAPI.completeEvent(eventId)
        alert("Event marked as completed!")
        fetchData()
      } catch (error) {
        console.error("Failed to complete event:", error)
        alert("Failed to mark event as completed. Please try again.")
      }
    }
  }

  const filteredEvents = events

  const getEventStats = () => {
    const total = events.length
    const urgent = events.filter(e => e.priority === 'urgent').length
    const thisWeek = events.filter(e => {
      const eventDate = new Date(e.eventDate)
      const now = new Date()
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      return eventDate >= now && eventDate <= weekFromNow
    }).length
    return { total, urgent, thisWeek }
  }

  const stats = getEventStats()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-300">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-purple-950/20">
        <div className="absolute inset-0 opacity-30"
             style={{
               backgroundImage: `radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%), 
                                radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.1) 0%, transparent 50%)`
             }}>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300">
                <Award className="mr-2 h-4 w-4" />
                Admin Control Center
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Event Management
                <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent"> Dashboard</span>
              </h1>
              <p className="mt-4 text-xl text-neutral-300 lg:max-w-3xl">
                Welcome, {user?.name || "Admin"}! Monitor, approve, and manage all event requests with powerful insights and streamlined workflows.
              </p>
              
              {}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <MetricCard 
                  title="Total Events" 
                  value={stats.total} 
                  icon={<ClipboardList className="h-5 w-5" />}
                />
                <MetricCard 
                  title="Urgent Priority" 
                  value={stats.urgent} 
                  icon={<AlertTriangle className="h-5 w-5" />}
                />
                <MetricCard 
                  title="This Week" 
                  value={stats.thisWeek} 
                  icon={<Calendar className="h-5 w-5" />}
                />
                <MetricCard 
                  title="Pending Review" 
                  value={activeTab === 'pending' ? events.length : '-'} 
                  icon={<Eye className="h-5 w-5" />}
                />
              </div>
            </div>
            
            {}
            <div className="mt-8 lg:mt-0">
              <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-900 p-1">
                <TabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Pending
                </TabButton>
                <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
                  <Users className="mr-2 h-4 w-4" />
                  All Events
                </TabButton>
                <TabButton active={activeTab === "denied"} onClick={() => setActiveTab("denied")}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Denied
                </TabButton>
                <TabButton active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </TabButton>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="mx-auto w-full max-w-7xl px-4 pb-14">
        {}
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onApprove={() => {
              handleApprove(selectedEvent._id)
              setSelectedEvent(null)
            }}
            onDeny={() => {
              handleDeny(selectedEvent._id)
              setSelectedEvent(null)
            }}
            onComplete={() => {
              handleComplete(selectedEvent._id)
              setSelectedEvent(null)
            }}
          />
        )}

        {}
        {activeTab === "pending" && (
          <section className="mt-8">
            <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">Pending Event Requests</h2>
            {filteredEvents.length === 0 ? (
              <EmptyState 
                icon={<ClipboardList className="h-12 w-12" />}
                title="No pending requests"
                subtitle="All caught up! No events awaiting review."
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {filteredEvents.map((event) => (
                  <AdminEventCard
                    key={event._id}
                    event={event}
                    onView={() => setSelectedEvent(event)}
                    onApprove={() => handleApprove(event._id)}
                    onDeny={() => handleDeny(event._id)}
                    isPending={true}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {}
        {activeTab === "all" && (
          <section className="mt-8">
            <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">All Events</h2>
            {filteredEvents.length === 0 ? (
              <EmptyState 
                icon={<Users className="h-12 w-12" />}
                title="No events found"
                subtitle="No events match your current filters."
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {filteredEvents.map((event) => (
                  <AdminEventCard
                    key={event._id}
                    event={event}
                    onView={() => setSelectedEvent(event)}
                    onComplete={() => handleComplete(event._id)}
                    isPending={false}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {}
        {activeTab === "denied" && (
          <section className="mt-8">
            <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">Denied Events</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
                <p className="mt-4 text-neutral-400">Loading denied events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <XCircle className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
                <p className="text-neutral-400">No denied events found.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <AdminEventCard 
                    key={event._id} 
                    event={event} 
                    onView={() => setSelectedEvent(event)}
                    isPending={false}
                    showActions={false} // Don't show approve/deny actions for denied events
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {}
        {activeTab === "analytics" && (
          <section className="mt-8">
            <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">Analytics Dashboard</h2>
            {analytics ? (
              <div className="space-y-8">
                {}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <MetricCard 
                    title="Total Events" 
                    value={analytics.totalEvents}
                    icon={<TrendingUp className="h-6 w-6" />}
                  />
                  <MetricCard
                    title="Average Rating"
                    value={analytics.averageRating ? analytics.averageRating.toFixed(1) : "N/A"}
                    icon={<Award className="h-6 w-6" />}
                    suffix="★"
                  />
                  <MetricCard
                    title="Total Feedback"
                    value={analytics.totalFeedback}
                    icon={<Users className="h-6 w-6" />}
                  />
                </div>

                {}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Card className="border-neutral-800 bg-neutral-900">
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-xl font-semibold flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Events by Status
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {(analytics.eventsByStatus || []).map((item) => (
                          <AnalyticsBar 
                            key={item._id} 
                            label={item._id} 
                            value={item.count} 
                            total={analytics.totalEvents}
                            color="emerald" 
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-neutral-800 bg-neutral-900">
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-xl font-semibold flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Events by Category
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {(analytics.eventsByCategory || []).map((item) => (
                          <AnalyticsBar 
                            key={item._id} 
                            label={item._id} 
                            value={item.count} 
                            total={analytics.totalEvents}
                            color="cyan" 
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <EmptyState 
                icon={<BarChart3 className="h-12 w-12" />}
                title="No analytics available"
                subtitle="Analytics will appear once you have event data."
              />
            )}
          </section>
        )}
      </div>
    </div>
  )
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardContent className="py-16 text-center">
        <div className="mx-auto mb-4 w-fit rounded-full bg-neutral-800 p-4 text-neutral-400">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-neutral-100">{title}</h3>
        <p className="text-neutral-400">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

function AdminEventCard({ event, onView, onApprove, onDeny, onComplete, isPending }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'TBD'
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return 'TBD'
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'TBD'
    return timeString
  }

  return (
    <Card className="group border-neutral-800 bg-neutral-900 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {}
        <div className="mb-4 flex items-start justify-between">
          <div className="min-w-0 flex-1 mr-3">
            <h3 className="line-clamp-2 text-lg font-semibold text-neutral-100 group-hover:text-emerald-400 transition-colors leading-tight">
              {event.title}
            </h3>
            <p className="mt-2 text-sm text-neutral-400">by {event.submittedBy?.name || 'Unknown'}</p>
          </div>
          <div className="flex-shrink-0">
            <StatusBadge status={event.status} size="sm" />
          </div>
        </div>

        {}
        <div className="space-y-3 flex-grow">
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <Calendar className="h-4 w-4 text-neutral-400 flex-shrink-0" />
            <span className="truncate">{formatDate(event.eventDate)}</span>
            <Clock className="ml-2 h-4 w-4 text-neutral-400 flex-shrink-0" />
            <span className="truncate">{formatTime(event.eventTime)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <Users className="h-4 w-4 text-neutral-400 flex-shrink-0" />
            <span className="truncate">{event.capacity || 0} capacity</span>
            <Tag className="ml-2 h-4 w-4 text-neutral-400 flex-shrink-0" />
            <span className="capitalize truncate">{event.category}</span>
          </div>

          {event.duration && (
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <Clock className="h-4 w-4 text-neutral-400 flex-shrink-0" />
              <span className="truncate">Duration: {event.duration}</span>
            </div>
          )}

          {event.estimatedCost && (
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <span className="text-emerald-400">£{event.estimatedCost}</span>
            </div>
          )}

          {event.priority && (
            <div className="flex items-center gap-2">
              <PriorityBadge priority={event.priority} />
            </div>
          )}

          {}
          {event.description && (
            <div className="mt-4">
              <p className="line-clamp-2 text-sm text-neutral-400 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {}
          {event.feedback && event.feedback.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${
                      i < Math.round(event.feedback.reduce((sum, f) => sum + f.rating, 0) / event.feedback.length)
                        ? 'text-yellow-400' 
                        : 'text-neutral-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-neutral-400">
                {(event.feedback.reduce((sum, f) => sum + f.rating, 0) / event.feedback.length).toFixed(1)} 
                ({event.feedback.length} review{event.feedback.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>

        {}
        <div className="mt-6 pt-4 border-t border-neutral-800">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onView}
              className="flex-1 border-neutral-700 text-neutral-300 hover:border-emerald-500 hover:text-emerald-400"
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            
            {isPending ? (
              <>
                <Button
                  size="sm"
                  onClick={onApprove}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 flex-shrink-0"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDeny}
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white flex-shrink-0"
                >
                  <X className="mr-1 h-4 w-4" />
                  Deny
                </Button>
              </>
            ) : event.status === 'approved' && (
              <Button
                size="sm"
                onClick={onComplete}
                className="bg-cyan-600 text-white hover:bg-cyan-700 flex-shrink-0"
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EventDetailModal({ event, onClose, onApprove, onDeny, onComplete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'TBD'
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'TBD'
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'TBD'
    return timeString
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-scroll rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        {}
        <div className="flex items-center justify-between border-b border-neutral-800 p-6">
          <h2 className="text-2xl font-bold text-neutral-100">Event Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-3xl font-bold text-neutral-100 mb-2">{event.title}</h3>
                <p className="text-neutral-400">Submitted by {event.submittedBy?.name || 'Unknown'}</p>
              </div>
              <StatusBadge status={event.status} />
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-neutral-400 mb-2">Date & Time</h4>
                  <div className="flex items-center gap-2 text-neutral-100">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-100 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(event.eventTime)}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-400 mb-2">Category & Capacity</h4>
                  <div className="flex items-center gap-2 text-neutral-100">
                    <Tag className="h-4 w-4" />
                    <span className="capitalize">{event.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-100 mt-1">
                    <Users className="h-4 w-4" />
                    <span>{event.capacity} people</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {event.priority && (
                  <div>
                    <h4 className="text-sm font-medium text-neutral-400 mb-2">Priority</h4>
                    <PriorityBadge priority={event.priority} />
                  </div>
                )}

                {event.estimatedCost && (
                  <div>
                    <h4 className="text-sm font-medium text-neutral-400 mb-2">Budget</h4>
                    <div className="flex items-center gap-2 text-neutral-100">
                      <span className="text-emerald-400 font-semibold">£{event.estimatedCost}</span>
                    </div>
                  </div>
                )}

                {event.duration && (
                  <div>
                    <h4 className="text-sm font-medium text-neutral-400 mb-2">Duration</h4>
                    <div className="flex items-center gap-2 text-neutral-100">
                      <Clock className="h-4 w-4" />
                      <span>{event.duration}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {}
            <div>
              <h4 className="text-sm font-medium text-neutral-400 mb-2">Description</h4>
              <p className="text-neutral-100 leading-relaxed">{event.description}</p>
            </div>

            {}
            {event.contactPerson && (
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-2">Contact Person</h4>
                <div className="bg-neutral-800 rounded-lg p-4 space-y-2">
                  {event.contactPerson.name && (
                    <div className="flex items-center gap-2 text-neutral-100">
                      <Users className="h-4 w-4" />
                      <span>{event.contactPerson.name}</span>
                    </div>
                  )}
                  {event.contactPerson.email && (
                    <div className="flex items-center gap-2 text-neutral-100">
                      <span className="text-emerald-400">✉</span>
                      <a href={`mailto:${event.contactPerson.email}`} className="text-emerald-400 hover:underline">
                        {event.contactPerson.email}
                      </a>
                    </div>
                  )}
                  {event.contactPerson.phone && (
                    <div className="flex items-center gap-2 text-neutral-100">
                      <span className="text-emerald-400">📞</span>
                      <a href={`tel:${event.contactPerson.phone}`} className="text-emerald-400 hover:underline">
                        {event.contactPerson.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {}
            <div>
              <h4 className="text-sm font-medium text-neutral-400 mb-2">Submitted By</h4>
              <div className="bg-neutral-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-neutral-100">
                  <Users className="h-4 w-4" />
                  <span>{event.submittedBy?.name || 'Unknown User'}</span>
                </div>
                {event.submittedBy?.email && (
                  <div className="flex items-center gap-2 text-neutral-100">
                    <span className="text-emerald-400">✉</span>
                    <a href={`mailto:${event.submittedBy.email}`} className="text-emerald-400 hover:underline">
                      {event.submittedBy.email}
                    </a>
                  </div>
                )}
                {event.submittedBy?.organization && (
                  <div className="flex items-center gap-2 text-neutral-100">
                    <span className="text-neutral-400">🏢</span>
                    <span>{event.submittedBy.organization}</span>
                  </div>
                )}
              </div>
            </div>

            {}
            {event.feedback && event.feedback.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-2">Event Feedback ({event.feedback.length})</h4>
                <div className="space-y-3">
                  {event.feedback.map((feedback, index) => (
                    <div key={index} className="bg-neutral-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-100">
                            {feedback.user?.name || feedback.userName || 'User'}
                          </span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < feedback.rating ? 'text-yellow-400' : 'text-neutral-600'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-neutral-400">
                            ({feedback.rating}/5)
                          </span>
                        </div>
                        <span className="text-xs text-neutral-500">
                          {feedback.createdAt ? formatDate(feedback.createdAt) : 'Recently'}
                        </span>
                      </div>
                      {feedback.comment && (
                        <p className="text-neutral-300 text-sm leading-relaxed">
                          "{feedback.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {}
                  <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-medium">Average Rating:</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < Math.round(event.feedback.reduce((sum, f) => sum + f.rating, 0) / event.feedback.length)
                                ? 'text-yellow-400' 
                                : 'text-neutral-600'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-emerald-400 font-semibold">
                        {(event.feedback.reduce((sum, f) => sum + f.rating, 0) / event.feedback.length).toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {}
            {event.tags && event.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {}
            {event.estimatedCost && (
              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-2">Estimated Cost</h4>
                <p className="text-2xl font-bold text-emerald-400">
                  ${event.estimatedCost.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="border-t border-neutral-800 p-6">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {event.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={onDeny}
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <X className="mr-2 h-4 w-4" />
                  Deny
                </Button>
                <Button
                  onClick={onApprove}
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
            {event.status === 'approved' && (
              <Button
                onClick={onComplete}
                className="bg-cyan-600 text-white hover:bg-cyan-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, trend, suffix = "" }) {
  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-400">{title}</p>
            <p className="text-3xl font-bold text-neutral-100">
              {value}{suffix}
            </p>
          </div>
          <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AnalyticsBar({ label, value, total, color }) {
  const percentage = total > 0 ? (value / total) * 100 : 0
  const colorClasses = {
    emerald: 'bg-emerald-500',
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500'
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-neutral-300 capitalize">{label}</span>
        <span className="text-neutral-400">{value}</span>
      </div>
      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorClasses[color] || colorClasses.emerald}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition " +
        (active ? "bg-emerald-500 text-neutral-900" : "text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100")
      }
    >
      {children}
    </button>
  )
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {icon ? <span className="text-neutral-400">{icon}</span> : null}
      <strong className="mr-1 text-neutral-200">{label}:</strong>
      <span className="text-neutral-300">{value || "-"}</span>
    </div>
  )
}

function NoteBlock({ color = "blue", title, text }) {
  const colorMap = {
    blue: "border-blue-400 bg-blue-500/10",
    amber: "border-amber-400 bg-amber-500/10",
    emerald: "border-emerald-400 bg-emerald-500/10",
  }
  return (
    <div className={`mb-4 rounded-md border-l-4 p-3 ${colorMap[color] || colorMap.blue}`}>
      <strong className="text-neutral-100">{title}:</strong>
      <span className="ml-2 text-neutral-300">{text}</span>
    </div>
  )
}

function KeyValuePill({ label, value, color = "emerald" }) {
  const colorMap = {
    emerald: "text-emerald-300",
    cyan: "text-cyan-300",
    amber: "text-amber-300",
    violet: "text-violet-300",
  }
  return (
    <div className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2">
      <span className="font-semibold capitalize text-neutral-200">{label}:</span>
      <span className={`font-bold ${colorMap[color] || colorMap.emerald}`}>{value}</span>
    </div>
  )
}

function fmtDate(val) {
  if (!val) return "-"
  try {
    return new Date(val).toLocaleDateString()
  } catch {
    return "-"
  }
}
