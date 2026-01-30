import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Head from 'next/head'
import { fetchPortfolioData } from '../utils/api'

export default function Contact() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPortfolioData()
        setPortfolioData(data)
      } catch (error) {
        console.error('Error loading portfolio data:', error)
      }
    }
    loadData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_API_URL || ''

      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: data.message || 'Message sent successfully!' })
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Failed to send message. Please try again.' })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const profile = portfolioData?.profile

  return (
    <>
      <Head>
        <title>Contact - Portfolio</title>
        <meta name="description" content="Get in touch for freelance projects, collaborations, or just to say hello." />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary-700/15 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-secondary-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="gradient-text">Let&apos;s Connect</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400">
                Have a project in mind? Looking for a developer for your team?
                Or just want to say hello? I&apos;d love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Get In Touch</h2>
                  <p className="text-slate-400 mb-8">
                    I&apos;m always open to discussing new projects, creative ideas,
                    or opportunities to be part of your vision. Whether it&apos;s an
                    enterprise solution, a startup MVP, or a consulting engagement,
                    let&apos;s talk about how I can help.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="space-y-4">
                  {/* Email */}
                  <a
                    href={`mailto:${profile?.email || 'contact@example.com'}`}
                    className="card flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">Email</div>
                      <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
                        {profile?.email || 'contact@example.com'}
                      </div>
                    </div>
                  </a>

                  {/* GitHub */}
                  <a
                    href={profile?.github || 'https://github.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-dark-tertiary flex items-center justify-center flex-shrink-0 group-hover:bg-primary-700/20 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">GitHub</div>
                      <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
                        View my repositories
                      </div>
                    </div>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={profile?.linkedin || 'https://linkedin.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-dark-tertiary flex items-center justify-center flex-shrink-0 group-hover:bg-primary-700/20 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">LinkedIn</div>
                      <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
                        Connect with me
                      </div>
                    </div>
                  </a>
                </div>

                {/* Availability Status */}
                <div className="card-glass p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium">Available for new projects</span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    I&apos;m currently accepting new clients and open to both short-term
                    and long-term engagements. Response time is usually within 24 hours.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="card-glass p-8">
                <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select a topic</option>
                      <option value="project">New Project</option>
                      <option value="consulting">Consulting</option>
                      <option value="job">Job Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="input-field resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  {/* Status Message */}
                  {submitStatus && (
                    <div className={`p-4 rounded-lg ${submitStatus.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                      }`}>
                      <div className="flex items-center gap-2">
                        {submitStatus.type === 'success' ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                          </svg>
                        )}
                        {submitStatus.message}
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-400">
                Quick answers to common questions
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'What is your typical response time?',
                  a: 'I usually respond within 24 hours during business days. For urgent matters, feel free to mention that in your message.'
                },
                {
                  q: 'Do you work with international clients?',
                  a: 'Absolutely! I work with clients globally and am comfortable with remote collaboration across different time zones.'
                },
                {
                  q: 'What types of projects do you take on?',
                  a: 'I specialize in enterprise solutions (ERP, CRM), admin dashboards, e-commerce platforms, SaaS applications, and custom web development.'
                },
                {
                  q: 'Do you offer ongoing maintenance and support?',
                  a: 'Yes, I offer maintenance packages and ongoing support for all projects I develop. We can discuss the details based on your needs.'
                },
              ].map((faq, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}
