import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TextField, Button, Paper, Typography, Box, CircularProgress } from '@mui/material'
import { supabase } from '../lib/supabaseClient'

interface DealInfo {
  basic: {
    title: string;
    price: string;
  };
  pro: {
    title: string;
    price: string;
  };
  enterprise: {
    title: string;
    price: string;
  };
}

export default function ContactPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [dealType, setDealType] = useState<keyof DealInfo>('basic')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })

  const deals: DealInfo = {
    basic: {
      title: 'Basic Plan',
      price: '$99/month'
    },
    pro: {
      title: 'Pro Plan',
      price: '$199/month'
    },
    enterprise: {
      title: 'Enterprise Plan',
      price: 'Custom'
    }
  }

  useEffect(() => {
    const deal = searchParams.get('deal') as keyof DealInfo
    if (deal && deals[deal]) {
      setDealType(deal)
    }
  }, [searchParams, deals])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('contact_requests')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            message: formData.message,
            deal_type: dealType,
            deal_price: deals[dealType].price,
            status: 'new'
          }
        ])

      if (error) throw error

      alert('Thank you for your interest! We will contact you soon.')
      router.push('/')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contact Us
        </Typography>
        
        <Typography variant="h6" color="primary" gutterBottom>
          Selected Plan: {deals[dealType].title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Price: {deals[dealType].price}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <TextField
              required
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              required
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          <TextField
            required
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            required
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Request'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
} 