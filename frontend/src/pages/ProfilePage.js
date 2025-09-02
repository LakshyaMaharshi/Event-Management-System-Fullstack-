"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI, usersAPI } from '../services/api'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { 
  User, Mail, Phone, Building, Calendar, Shield, 
  Edit3, Save, X, Eye, EyeOff, Key, CheckCircle,
  BarChart3, Clock, CheckCircle2, XCircle
} from 'lucide-react'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [userStats, setUserStats] = useState(null)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        organization: user.organization || '',
      })
    }
    fetchUserStats()
  }, [user])

  const fetchUserStats = async () => {
    try {
      const response = await usersAPI.getUserStats()
      setUserStats(response.data.data)
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const response = await authAPI.updateProfile(profileData)
      if (response.data.success) {
        updateUser(response.data.data)
        setIsEditing(false)
        alert('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long!')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      if (response.data.success) {
        setShowPasswordForm(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        alert('Password changed successfully!')
      }
    } catch (error) {
      console.error('Failed to change password:', error)
      const errorMessage = error.response?.data?.message || 'Failed to change password. Please try again.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-300">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </div>
    )
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      organization: user.organization || '',
    })
  }

  const cancelPasswordChange = () => {
    setShowPasswordForm(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  const getJoinDate = () => {
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    return 'Unknown'
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">My Profile</h1>
          <p className="text-neutral-400">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {}
          <div className="lg:col-span-1">
            <Card className="border-neutral-800 bg-neutral-900">
              <CardContent className="p-6 text-center">
                {}
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-2xl font-bold text-neutral-900">
                  {getInitials(user?.name)}
                </div>
                
                {}
                <h2 className="text-xl font-semibold text-neutral-100 mb-1">
                  {user?.name || 'User Name'}
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-neutral-400 mb-2">
                  <Shield className="h-4 w-4" />
                  <span className="capitalize">{user?.role || 'User'}</span>
                </div>
                <p className="text-sm text-neutral-400 mb-4">
                  {user?.email || 'user@example.com'}
                </p>

                {}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-neutral-800">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-emerald-400">
                      {userStats?.totalEvents || 0}
                    </div>
                    <div className="text-xs text-neutral-400">Total Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-cyan-400">
                      {userStats?.completedEvents || 0}
                    </div>
                    <div className="text-xs text-neutral-400">Completed</div>
                  </div>
                </div>
                
                <div className="text-xs text-neutral-400 mt-2">
                  Member since {userStats?.memberSince ? formatDate(userStats.memberSince) : 'Unknown'}
                </div>
              </CardContent>
            </Card>
          </div>

          {}
          <div className="lg:col-span-2 space-y-6">
            {}
            <Card className="border-neutral-800 bg-neutral-900">
              <div className="flex items-center justify-between border-b border-neutral-800 p-6">
                <h3 className="text-lg font-semibold text-neutral-100">Personal Information</h3>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={cancelEdit}
                      variant="outline"
                      size="sm"
                      className="border-neutral-600 text-neutral-400 hover:bg-neutral-800"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      size="sm"
                      disabled={loading}
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    ) : (
                      <p className="text-neutral-300 p-2 bg-neutral-800 rounded-lg">
                        {user?.name || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    ) : (
                      <p className="text-neutral-300 p-2 bg-neutral-800 rounded-lg">
                        {user?.email || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Not provided"
                      />
                    ) : (
                      <p className="text-neutral-300 p-2 bg-neutral-800 rounded-lg">
                        {user?.phone || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">
                      <Building className="h-4 w-4 inline mr-2" />
                      Organization
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="organization"
                        value={profileData.organization}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Not provided"
                      />
                    ) : (
                      <p className="text-neutral-300 p-2 bg-neutral-800 rounded-lg">
                        {user?.organization || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {}
            <Card className="border-neutral-800 bg-neutral-900">
              <div className="flex items-center justify-between border-b border-neutral-800 p-6">
                <h3 className="text-lg font-semibold text-neutral-100">Security Settings</h3>
                {!showPasswordForm && (
                  <Button
                    onClick={() => setShowPasswordForm(true)}
                    variant="outline"
                    size="sm"
                    className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                )}
              </div>
              
              <CardContent className="p-6">
                {!showPasswordForm ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-100">Password</h4>
                          <p className="text-sm text-neutral-400">Last updated recently</p>
                        </div>
                      </div>
                      <div className="text-sm text-emerald-400">••••••••</div>
                    </div>
                    <p className="text-sm text-neutral-400">
                      Keep your account secure by using a strong password and changing it regularly.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-200 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 pr-10 text-neutral-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-200 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 pr-10 text-neutral-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-200 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 pr-10 text-neutral-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={cancelPasswordChange}
                        variant="outline"
                        className="flex-1 border-neutral-600 text-neutral-400 hover:bg-neutral-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleChangePassword}
                        disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {}
            {userStats && (
              <Card className="border-neutral-800 bg-neutral-900">
                <div className="border-b border-neutral-800 p-6">
                  <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Event Statistics
                  </h3>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-neutral-800/50">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">
                        {userStats.totalEvents}
                      </div>
                      <div className="text-sm text-neutral-400">Total Events</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-neutral-800/50">
                      <div className="text-2xl font-bold text-amber-400 mb-1 flex items-center justify-center gap-1">
                        <Clock className="h-5 w-5" />
                        {userStats.pendingEvents}
                      </div>
                      <div className="text-sm text-neutral-400">Pending</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-neutral-800/50">
                      <div className="text-2xl font-bold text-green-400 mb-1 flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-5 w-5" />
                        {userStats.approvedEvents}
                      </div>
                      <div className="text-sm text-neutral-400">Approved</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-neutral-800/50">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">
                        {userStats.completedEvents}
                      </div>
                      <div className="text-sm text-neutral-400">Completed</div>
                    </div>
                  </div>
                  {userStats.deniedEvents > 0 && (
                    <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center gap-2 text-red-400">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm">
                          {userStats.deniedEvents} event{userStats.deniedEvents !== 1 ? 's' : ''} denied
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
