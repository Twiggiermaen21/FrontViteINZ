import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/aiTools'
import ImageGallery from '../components/ImageGallery'
import Footer from '../components/Footer'
const StartPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <ImageGallery />
      <AiTools />
      <Footer />
    </div>
  )
}

export default StartPage