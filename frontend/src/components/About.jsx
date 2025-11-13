import React from 'react'
import { motion } from 'framer-motion'
import { FaCode, FaDatabase, FaCloud, FaMobile, FaWindows } from 'react-icons/fa'
import AnimatedSection from './AnimatedSection'
import AnimatedCard from './AnimatedCard'

const About = () => {
  const skills = [
    { icon: <FaCode />, title: 'Frontend Development', description: 'React, Vue, Angular, HTML5, CSS3, JavaScript, React Native, Responsive Design' },
    { icon: <FaDatabase />, title: 'Backend Development', description: 'Python, Node.js, Flask, FastAPI, REST APIs, SQL' },
    { icon: <FaCloud />, title: 'Cloud & DevOps', description: 'AWS, Azure, Docker, CI/CD, Git, GitHub Actions' },
    { icon: <FaWindows />, title: 'Application Development', description: 'C#, Java' },
  ]

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-1 bg-primary-600 dark:bg-primary-400 mx-auto"
            />
          </div>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Who I Am</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              I'm a passionate full-stack developer with a love for creating innovative solutions
              and solving complex problems. With expertise in modern web technologies, I bring
              ideas to life through clean, efficient, and scalable code.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              My journey in software development has been driven by curiosity and a commitment to
              continuous learning. I enjoy working on projects that challenge me and allow me to
              grow both technically and personally.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              When I'm not coding, you can find me exploring new technologies, contributing to
              open-source projects, or sharing knowledge with the developer community or enjoying a good beach day.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">What I Do</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              I specialize in building full-stack applications using modern frameworks and
              technologies. My approach combines clean architecture, best practices, and
              user-centered design to deliver exceptional digital experiences.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              From concept to deployment, I handle every aspect of the development lifecycle,
              ensuring that each project meets the highest standards of quality and performance.
            </p>
          </div>
        </div>

        <AnimatedSection>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">Skills & Technologies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <AnimatedCard key={index} index={index}>
                  <motion.div
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="card text-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className="text-4xl text-primary-600 dark:text-primary-400 mb-4 flex justify-center"
                    >
                      {skill.icon}
                    </motion.div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{skill.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{skill.description}</p>
                  </motion.div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default About

