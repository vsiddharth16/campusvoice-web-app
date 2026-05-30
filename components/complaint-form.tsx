'use client'

import { useState, useRef } from 'react'
import { Plus, Upload, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useApp } from '@/lib/store'
import { ComplaintCategory, ComplaintPriority } from '@/lib/types'

const categories: ComplaintCategory[] = ['Hostel', 'Canteen', 'WiFi', 'Infrastructure', 'Other']
const priorities: ComplaintPriority[] = ['Low', 'Medium', 'High', 'Urgent']

export function ComplaintForm() {
  const { addComplaint } = useApp()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    category: '' as ComplaintCategory,
    priority: '' as ComplaintPriority,
    description: '',
    photoUrl: ''
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPhotoPreview(result)
        setFormData(prev => ({ ...prev, photoUrl: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const id = await addComplaint({
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        description: formData.description,
        photoUrl: formData.photoUrl || undefined
      })
      
      setSuccess(id)
      setFormData({
        title: '',
        category: '' as ComplaintCategory,
        priority: '' as ComplaintPriority,
        description: '',
        photoUrl: ''
      })
      setPhotoPreview(null)
      
      setTimeout(() => setSuccess(null), 5000)
    } catch {
      setError('Failed to submit complaint. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Submit New Complaint
        </CardTitle>
        <CardDescription>
          Fill out the form below to submit a new complaint
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Complaint Submitted Successfully!</p>
              <p className="text-sm text-green-700">Your complaint ID is <strong>{success}</strong></p>
              <p className="text-sm text-green-600 mt-1">You will be notified when status updates.</p>
            </div>
          </div>
        )}
        
        {error && (
          <p className="mb-4 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Complaint Title</Label>
            <Input
              id="title"
              placeholder="Brief title for your complaint"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: ComplaintCategory) => 
                  setFormData(prev => ({ ...prev, category: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: ComplaintPriority) => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(pri => (
                    <SelectItem key={pri} value={pri}>{pri}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your complaint in detail..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Photo (Optional)</Label>
            <div 
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="max-h-40 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-2">Click to change photo</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload a photo</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading || !formData.category || !formData.priority}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Complaint
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
