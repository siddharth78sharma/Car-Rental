import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'
import MapSection from '../components/MapSection'

const Home = () => {
  return (
    <>
     <Hero />
     <MapSection className="mt-8 mb-8" />
     <FeaturedSection />
     <Banner />
     <Testimonial />
     <Newsletter/>
    </>
  )
}

export default Home