import React from 'react'
import { motion } from 'framer-motion'
import { FaMedium, FaExternalLinkAlt, FaCalendar, FaExclamationTriangle, FaRedo } from 'react-icons/fa'
import AnimatedSection from './AnimatedSection'
import AnimatedCard from './AnimatedCard'

const Blog = ({ posts, loading, error, onRetry }) => {
  if (loading) {
    return (
      <section id="blog" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Blog</h2>
            <div className="w-24 h-1 bg-primary-600 dark:bg-primary-400 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading blog posts from Medium...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="blog" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Blog</h2>
            <div className="w-24 h-1 bg-primary-600 dark:bg-primary-400 mx-auto"></div>
          </div>
          <div className="text-center py-12">
            <FaExclamationTriangle className="mx-auto text-yellow-500 dark:text-yellow-400 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">Unable to load blog posts</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <FaRedo /> Retry
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
      return dateString
    }
  }

  return (
    <section id="blog" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Blog</h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-1 bg-primary-600 dark:bg-primary-400 mx-auto"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Read my latest articles and stories on Medium
            </motion.p>
          </div>
        </AnimatedSection>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <FaMedium className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">No blog posts found.</p>
            <div className="text-gray-500 dark:text-gray-400 text-sm space-y-1 max-w-md mx-auto mb-4">
              <p>This could mean:</p>
              <ul className="list-disc list-inside text-left mt-2 space-y-1">
                <li>Your Medium username might not be configured correctly</li>
                <li>The backend server might not be running</li>
                <li>You might not have any published articles</li>
                <li>There might be a connection issue</li>
              </ul>
              <p className="mt-4 text-xs">Check the browser console (F12) for error details</p>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <FaRedo /> Retry
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <AnimatedCard key={index} index={index}>
                <motion.article
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="card group overflow-hidden"
                >
                {post.image && (
                  <div className="w-full h-48 overflow-hidden mb-4 rounded-lg">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-1">
                    {post.title}
                  </h3>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ml-2"
                    title="Read on Medium"
                  >
                    <FaExternalLinkAlt size={18} />
                  </a>
                </div>
                
                {post.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm">
                    {post.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <FaCalendar />
                    <span>{formatDate(post.published)}</span>
                  </div>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <FaMedium size={14} />
                    <span>Read More</span>
                  </a>
                </div>
              </motion.article>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Blog

