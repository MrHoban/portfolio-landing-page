import React from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaStar, FaCodeBranch, FaExclamationTriangle, FaRedo } from 'react-icons/fa'
import AnimatedSection from './AnimatedSection'
import AnimatedCard from './AnimatedCard'

const Projects = ({ repos, loading, error, onRetry }) => {
  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Projects</h2>
            <div className="w-24 h-1 bg-primary-600 dark:bg-primary-400 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading projects from GitHub...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Projects</h2>
            <div className="w-24 h-1 bg-primary-600 dark:bg-primary-400 mx-auto"></div>
          </div>
          <div className="text-center py-12">
            <FaExclamationTriangle className="mx-auto text-yellow-500 dark:text-yellow-400 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">Unable to load repositories</p>
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

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Projects</h2>
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
              Explore my GitHub repositories and see what I've been working on
            </motion.p>
          </div>
        </AnimatedSection>

        {!repos || repos.length === 0 ? (
          <div className="text-center py-12">
            <FaGithub className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">No repositories found.</p>
            <div className="text-gray-500 dark:text-gray-400 text-sm space-y-1 max-w-md mx-auto mb-4">
              <p>This could mean:</p>
              <ul className="list-disc list-inside text-left mt-2 space-y-1">
                <li>Your GitHub username might not be configured correctly</li>
                <li>The backend server might not be running</li>
                <li>You might not have any public repositories</li>
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
            {repos.map((repo, index) => (
              <AnimatedCard key={repo.id} index={index}>
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="card group"
                >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {repo.name}
                  </h3>
                  <div className="flex gap-2">
                    {repo.html_url && (
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        title="View on GitHub"
                      >
                        <FaGithub size={20} />
                      </a>
                    )}
                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        title="Live Demo"
                      >
                        <FaExternalLinkAlt size={18} />
                      </a>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {repo.description || 'No description available'}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {repo.topics && repo.topics.slice(0, 3).map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FaStar /> {repo.stargazers_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCodeBranch /> {repo.forks_count || 0}
                    </span>
                  </div>
                  <span className="text-xs">
                    {repo.language || 'N/A'}
                  </span>
                </div>
              </motion.div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Projects

