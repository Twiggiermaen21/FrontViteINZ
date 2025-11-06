import React from 'react'
import Navbar from '../components/startPage/Navbar'
import Hero from '../components/startPage/Hero'
import AiTools from '../components/startPage/AiTools'
import ImageGallery from '../components/startPage/ImageGallery'
import Footer from '../components/startPage/Footer'
const StartPage = () => {
  return (
    <div className='bg-[#1e1f1f]'>
      <Navbar />
      <Hero />
      <ImageGallery />
      <AiTools />
      <Footer />
    </div>
  )
}

export default StartPage