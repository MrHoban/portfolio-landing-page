import React, { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  const [repos, setRepos] = useState([])
  const [reposLoading, setReposLoading] = useState(true)
  const [reposError, setReposError] = useState(null)
  
  const [blogPosts, setBlogPosts] = useState([])
  const [blogLoading, setBlogLoading] = useState(true)
  const [blogError, setBlogError] = useState(null)

  useEffect(() => {
    fetchRepos()
    fetchBlogPosts()
  }, [])

  const API_URL = import.meta.env.VITE_API_URL || ''

  const fetchRepos = async () => {
    try {
      setReposError(null)
      setReposLoading(true)
      const response = await fetch(`${API_URL}/api/repos`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch repositories: ${response.statusText} (${response.status})`)
      }
      
      const data = await response.json()
      
      // Check if the response is an error object
      if (data.error) {
        throw new Error(data.error)
      }
      
      setRepos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching repos:', error)
      setReposError(error.message)
      setRepos([])
    } finally {
      setReposLoading(false)
    }
  }

  const fetchBlogPosts = async () => {
    try {
      setBlogError(null)
      setBlogLoading(true)
      const response = await fetch(`${API_URL}/api/blog`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch blog posts: ${response.statusText} (${response.status})`)
      }
      
      const data = await response.json()
      
      // Check if the response is an error object
      if (data.error) {
        throw new Error(data.error)
      }
      
      setBlogPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      setBlogError(error.message)
      setBlogPosts([])
    } finally {
      setBlogLoading(false)
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <Hero />
        <About />
        <Projects repos={repos} loading={reposLoading} error={reposError} onRetry={fetchRepos} />
        <Blog posts={blogPosts} loading={blogLoading} error={blogError} onRetry={fetchBlogPosts} />
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App

