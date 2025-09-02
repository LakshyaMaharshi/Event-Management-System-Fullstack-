"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { eventsAPI } from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import StatusBadge, { PriorityBadge } from "../components/status-badge"
import { 
  Calendar, Clock, MapPin, Layers3, RefreshCw, Plus, Copy, Star, 
  Filter, Search, Bookmark, DollarSign, Users 
} from "lucide-react"

export default function UserDashboard() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "",
    duration: "",
    venue: "",
    capacity: "",
    category: "meeting",
    priority: "medium",
    estimatedCost: "",
    tags: "",
    requirements: "",
    contactPerson: { name: "", email: "", phone: "" },
  })

  useEffect(() => {
    fetchEvents()
    fetchTemplates()

  }, [])

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getMyEvents()
      setEvents(response?.data?.data || [])
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await eventsAPI.getTemplates()
      setTemplates(response?.data?.data || [])
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    }
  }

  const handleUseTemplate = (template) => {
    setFormData({
      title: template.title,
      description: template.description,
      eventDate: "",
      eventTime: template.eventTime,
      duration: template.duration,
      venue: template.venue,
      capacity: template.capacity,
      category: template.category,
      priority: template.priority || "medium",
      estimatedCost: template.estimatedCost || "",
      tags: template.tags?.join(", ") || "",
      requirements: template.requirements || "",
      contactPerson: template.contactPerson || { name: "", email: "", phone: "" },
    })
    setShowTemplates(false)
    setShowEventForm(true)
  }

  const handleDuplicate = async (eventId) => {
    try {
      await eventsAPI.duplicateEvent(eventId)
      fetchEvents()
      alert("Event duplicated successfully!")
    } catch (error) {
      console.error("Failed to duplicate event:", error)
      alert("Failed to duplicate event.")
    }
  }

  const handleSaveAsTemplate = async (eventId) => {
    const templateName = window.prompt("Enter template name:")
    if (!templateName) return
    
    try {
      await eventsAPI.saveAsTemplate(eventId, templateName)
      fetchTemplates()
      alert("Template saved successfully!")
    } catch (error) {
      console.error("Failed to save template:", error)
      alert("Failed to save template.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("contactPerson.")) {
      const field = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        contactPerson: { ...prev.contactPerson, [field]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
      }
      await eventsAPI.createEvent(submitData)
      setShowEventForm(false)
      resetForm()
      fetchEvents()
      alert("Event request submitted successfully!")
    } catch (error) {
      console.error("Failed to submit event:", error)
      alert("Failed to submit event request. Please try again.")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      eventDate: "",
      eventTime: "",
      duration: "",
      venue: "",
      capacity: "",
      category: "meeting",
      priority: "medium",
      estimatedCost: "",
      tags: "",
      requirements: "",
      contactPerson: { name: "", email: "", phone: "" },
    })
  }

  const filteredEvents = events.filter(event => {
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getEventStats = () => {
    const total = events.length
    const pending = events.filter(e => e.status === 'pending').length
    const approved = events.filter(e => e.status === 'approved').length
    const completed = events.filter(e => e.status === 'completed').length
    return { total, pending, approved, completed }
  }

  const stats = getEventStats()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-300">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="mt-4">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-emerald-950/20">
        <div className="absolute inset-0 opacity-30"
             style={{
               backgroundImage: `radial-gradient(circle at 20% 50%, rgba(5, 150, 105, 0.1) 0%, transparent 50%), 
                                radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)`
             }}>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
                <Star className="mr-2 h-4 w-4" />
                Welcome back, {user?.name || "Event Planner"}!
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Your Event
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"> Command Center</span>
              </h1>
              <p className="mt-4 text-xl text-neutral-300 lg:max-w-3xl">
                Streamline your event planning process with our intelligent dashboard. 
                Create, track, and manage all your events in one powerful platform.
              </p>
              
              {}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total Events" value={stats.total} icon={<Layers3 className="h-5 w-5" />} />
                <StatCard label="Pending" value={stats.pending} icon={<Clock className="h-5 w-5" />} color="amber" />
                <StatCard label="Approved" value={stats.approved} icon={<Calendar className="h-5 w-5" />} color="emerald" />
                <StatCard label="Completed" value={stats.completed} icon={<Star className="h-5 w-5" />} color="blue" />
              </div>
            </div>
            
            {}
            <div className="mt-8 flex flex-col gap-4 lg:mt-0">
              <Button
                onClick={() => setShowEventForm(true)}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3 text-lg font-semibold text-neutral-900 hover:from-emerald-400 hover:to-cyan-400"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Event
              </Button>
              <Button
                onClick={() => setShowTemplates(true)}
                variant="outline"
                className="border-emerald-500/40 bg-transparent px-8 py-3 text-emerald-300 hover:bg-emerald-500/10"
              >
                <Bookmark className="mr-2 h-5 w-5" />
                Use Template
              </Button>
            </div>
          </div>
        </div>
      </section>

      {}
      <div className="mx-auto w-full max-w-7xl px-4 pb-14">
        {}
        {showEventForm && <EventFormModal 
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={() => { setShowEventForm(false); resetForm(); }}
        />}

        {}
        {showTemplates && <TemplateModal 
          templates={templates}
          onUseTemplate={handleUseTemplate}
          onClose={() => setShowTemplates(false)}
        />}

        {}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 pl-10 pr-4 py-2 text-neutral-100 placeholder-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-neutral-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="denied">Denied</option>
              </select>
            </div>
          </div>
          <Button
            onClick={fetchEvents}
            variant="outline"
            className="border-emerald-500/40 bg-transparent text-emerald-300 hover:bg-emerald-500/10"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {}
        <div className="mt-8">
          <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">Your Events</h2>
          {filteredEvents.length === 0 ? (
            <EmptyState onCreateEvent={() => setShowEventForm(true)} />
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onDuplicate={() => handleDuplicate(event._id)}
                  onSaveAsTemplate={() => handleSaveAsTemplate(event._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color = "neutral" }) {
  const colorMap = {
    neutral: "border-neutral-700 bg-neutral-800",
    amber: "border-amber-500/30 bg-amber-500/10",
    emerald: "border-emerald-500/30 bg-emerald-500/10",
    blue: "border-blue-500/30 bg-blue-500/10",
  }

  return (
    <div className={`rounded-lg border p-4 ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-400">{label}</p>
          <p className="text-2xl font-bold text-neutral-100">{value}</p>
        </div>
        <div className="text-neutral-400">{icon}</div>
      </div>
    </div>
  )
}

function EventCard({ event, onDuplicate, onSaveAsTemplate }) {
  return (
    <Card className="group border-neutral-800 bg-neutral-900 transition-all hover:border-neutral-700 hover:shadow-lg">
      <CardContent className="p-6">
        {}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-neutral-100">{event.title}</h3>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={event.status} />
              {event.priority && <PriorityBadge priority={event.priority} />}
            </div>
          </div>
          <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="ghost"
              onClick={onDuplicate}
              className="h-8 w-8 p-0 hover:bg-neutral-800"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onSaveAsTemplate}
              className="h-8 w-8 p-0 hover:bg-neutral-800"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {}
        <p className="mb-4 text-neutral-300 line-clamp-2">{event.description}</p>

        {}
        <div className="mb-4 space-y-2 text-sm">
          <DetailRow icon={<Calendar className="h-4 w-4" />} label="Date" value={formatDate(event.eventDate)} />
          <DetailRow icon={<Clock className="h-4 w-4" />} label="Time" value={event.eventTime} />
          <DetailRow icon={<MapPin className="h-4 w-4" />} label="Venue" value={event.venue} />
          <DetailRow icon={<Users className="h-4 w-4" />} label="Capacity" value={`${event.capacity} people`} />
          {event.estimatedCost && (
            <DetailRow icon={<DollarSign className="h-4 w-4" />} label="Budget" value={`$${event.estimatedCost}`} />
          )}
        </div>

        {}
        {event.tags && event.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300"
              >
                #{tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="rounded-full bg-neutral-700 px-2 py-1 text-xs text-neutral-400">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {}
        {event.reviewNotes && (
          <div className="rounded-md border-l-4 border-emerald-500/50 bg-emerald-500/10 p-3">
            <strong className="text-neutral-100">Admin Notes:</strong>
            <span className="ml-2 text-neutral-300">{event.reviewNotes}</span>
          </div>
        )}

        {}
        <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-4 text-xs text-neutral-400">
          <span>Submitted {formatDate(event.createdAt)}</span>
          <span className="capitalize">{event.category}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function EventFormModal({ formData, onInputChange, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card className="border-neutral-800 bg-neutral-900">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-2xl font-semibold">Create New Event</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              className="h-8 w-8 rounded-md p-0 text-neutral-400 hover:bg-neutral-800"
            >
              ×
            </Button>
          </div>
          
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-6">
              {}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormGroup label="Event Title *" htmlFor="title">
                  <Input id="title" name="title" value={formData.title} onChange={onInputChange} required />
                </FormGroup>
                <FormGroup label="Category *" htmlFor="category">
                  <Select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={onInputChange}
                    required
                    options={[
                      { value: "meeting", label: "Meeting" },
                      { value: "conference", label: "Conference" },
                      { value: "workshop", label: "Workshop" },
                      { value: "seminar", label: "Seminar" },
                      { value: "training", label: "Training" },
                      { value: "networking", label: "Networking" },
                      { value: "celebration", label: "Celebration" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </FormGroup>
              </div>

              <FormGroup label="Description *" htmlFor="description">
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={onInputChange}
                  required
                  rows={3}
                  placeholder="Describe your event..."
                />
              </FormGroup>

              {}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormGroup label="Event Date *" htmlFor="eventDate">
                  <Input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={onInputChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </FormGroup>
                <FormGroup label="Event Time *" htmlFor="eventTime">
                  <Input
                    type="time"
                    id="eventTime"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={onInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup label="Duration *" htmlFor="duration">
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={onInputChange}
                    placeholder="e.g., 2 hours"
                    required
                  />
                </FormGroup>
              </div>

              {}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormGroup label="Venue *" htmlFor="venue">
                  <Input id="venue" name="venue" value={formData.venue} onChange={onInputChange} required />
                </FormGroup>
                <FormGroup label="Expected Capacity *" htmlFor="capacity">
                  <Input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={onInputChange}
                    required
                    min="1"
                  />
                </FormGroup>
              </div>

              {}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormGroup label="Priority" htmlFor="priority">
                  <Select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={onInputChange}
                    options={[
                      { value: "low", label: "Low Priority" },
                      { value: "medium", label: "Medium Priority" },
                      { value: "high", label: "High Priority" },
                      { value: "urgent", label: "Urgent" },
                    ]}
                  />
                </FormGroup>
                <FormGroup label="Estimated Cost" htmlFor="estimatedCost">
                  <Input
                    type="number"
                    id="estimatedCost"
                    name="estimatedCost"
                    value={formData.estimatedCost}
                    onChange={onInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </FormGroup>
              </div>

              {}
              <FormGroup label="Tags" htmlFor="tags" hint="Separate tags with commas (e.g., team-building, quarterly, remote)">
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={onInputChange}
                  placeholder="team-building, quarterly, remote"
                />
              </FormGroup>

              <FormGroup label="Special Requirements" htmlFor="requirements">
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={onInputChange}
                  rows={2}
                  placeholder="Any special equipment, catering, or setup requirements..."
                />
              </FormGroup>

              {}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Contact Person</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormGroup label="Contact Name" htmlFor="contactPerson.name">
                    <Input
                      id="contactPerson.name"
                      name="contactPerson.name"
                      value={formData.contactPerson.name}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                  <FormGroup label="Contact Email" htmlFor="contactPerson.email">
                    <Input
                      type="email"
                      id="contactPerson.email"
                      name="contactPerson.email"
                      value={formData.contactPerson.email}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                  <FormGroup label="Contact Phone" htmlFor="contactPerson.phone">
                    <Input
                      type="tel"
                      id="contactPerson.phone"
                      name="contactPerson.phone"
                      value={formData.contactPerson.phone}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </div>
              </div>

              {}
              <div className="flex justify-end gap-3 border-t border-neutral-800 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-500 text-neutral-900 hover:bg-emerald-400">
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TemplateModal({ templates, onUseTemplate, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden border-neutral-800 bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-800 p-6">
          <h2 className="text-2xl font-semibold">Choose a Template</h2>
          <Button onClick={onClose} variant="ghost" className="h-8 w-8 p-0 text-neutral-400 hover:bg-neutral-800">
            ×
          </Button>
        </div>
        
        <CardContent className="overflow-y-auto p-6">
          {templates.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <Bookmark className="mx-auto mb-4 h-12 w-12 text-neutral-600" />
              <p>No templates available yet.</p>
              <p className="text-sm">Create an event and save it as a template to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {templates.map((template) => (
                <div
                  key={template._id}
                  className="cursor-pointer rounded-lg border border-neutral-700 bg-neutral-800 p-4 transition-colors hover:border-emerald-500"
                  onClick={() => onUseTemplate(template)}
                >
                  <h3 className="font-semibold text-neutral-100">{template.templateName || template.title}</h3>
                  <p className="mt-1 text-sm text-neutral-400">{template.category} • {template.duration}</p>
                  <p className="mt-2 text-sm text-neutral-300 line-clamp-2">{template.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-emerald-300">Use Template</span>
                    <span className="text-xs text-neutral-500">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyState({ onCreateEvent }) {
  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardContent className="flex flex-col items-center justify-center gap-6 py-16">
        <div className="rounded-full bg-emerald-500/10 p-6">
          <Calendar className="h-12 w-12 text-emerald-400" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-neutral-100">No events yet</h3>
          <p className="mt-2 text-neutral-400">Start by creating your first event request</p>
        </div>
        <Button
          onClick={onCreateEvent}
          className="bg-emerald-500 text-neutral-900 hover:bg-emerald-400"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Event
        </Button>
      </CardContent>
    </Card>
  )
}

function FormGroup({ label, htmlFor, children, hint }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-neutral-200">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-neutral-400">{hint}</p>}
    </div>
  )
}

function Input(props) {
  return (
    <input
      {...props}
      className={
        "block w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 " +
        (props.className || "")
      }
    />
  )
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={
        "block w-full resize-y rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 " +
        (props.className || "")
      }
    />
  )
}

function Select({ options = [], ...props }) {
  return (
    <select
      {...props}
      className={
        "block w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 " +
        (props.className || "")
      }
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-neutral-900 text-neutral-100">
          {opt.label}
        </option>
      ))}
    </select>
  )
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {icon && <span className="text-neutral-400">{icon}</span>}
      <strong className="text-neutral-200">{label}:</strong>
      <span className="text-neutral-300">{value || "-"}</span>
    </div>
  )
}

function formatDate(val) {
  if (!val) return "-"
  try {
    return new Date(val).toLocaleDateString()
  } catch {
    return "-"
  }
}
