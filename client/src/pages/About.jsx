import React from 'react'

const About = () => {
  const data = [
    {
      title: "Secure",
      text: "Passowrd are securely hashed before they are stored."
    },
    {
      title: "Modern",
      text: "Built with React, Express, MongoDB and modern web practices."
    },
    {
      title: "Scalable",
      text: "The application is structured so new features can be easily added."
    }
  ]
  return (
    <div className='min-h-screen bg-slate-50'>
      <main className='mx-auto max-w-5xl px-6 py-20'>
        <div className='max-w-3xl'>
          <p className='font-semibold text-indigo-600'>
            ABOUT
          </p>

          <h1 className='mt-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl'>
            Authentication built with modern technologies.
          </h1>

          <p className='mt-6 text-lg leading-8 text-slate-600'>
            This project demonstrates a modern full-stack authentication system with a React frontend an Node.js backend.
          </p>
        </div>

        <div className='mt-12 grid gap-6 md:grid-cols-3'>
          {
            data.map((item) => (
              <div key={item.title} className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
                <h2 className='text-xl font-bold text-slate-900'>{item.title}</h2>
                <p className='mt-3 leading-7 text-slate-600'>{item.text}</p>
              </div>
            ))
          }
        </div>
      </main>
    </div>
  )
}

export default About