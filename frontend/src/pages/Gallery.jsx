import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const Gallery = () => {

  const { backendUrl } = useContext(AppContext)
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  // Fetch gallery items
  const fetchGalleryItems = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(backendUrl + '/api/user/gallery')
      if (data.success) {
        setGalleryItems(data.galleryItems)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  return (
    <div>
      {/* Header */}
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>OUR <span className='text-gray-700 font-medium'>GALLERY</span></p>
      </div>

      <div className='my-10 text-center text-sm text-gray-600 max-w-2xl mx-auto px-4'>
        <p>Explore our clinic's journey through images. From our state-of-the-art facilities to memorable moments with our patients and staff, these photos showcase our commitment to quality healthcare and community service.</p>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className='flex justify-center items-center py-20'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      ) : galleryItems.length === 0 ? (
        <div className='text-center py-20 text-gray-500'>
          <svg className='w-20 h-20 mx-auto mb-4 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
          </svg>
          <p className='text-lg'>No images available yet</p>
          <p className='text-sm text-gray-400 mt-2'>Check back soon for updates!</p>
        </div>
      ) : (
        <div className='px-4 sm:px-8 md:px-16 lg:px-32 mb-20'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {galleryItems.map((item, index) => (
              <div 
                key={index} 
                className='group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2'
                onClick={() => setSelectedImage(item)}
              >
                <div className='aspect-square overflow-hidden bg-gray-100'>
                  <img 
                    src={item.image} 
                    alt={item.title || 'Gallery image'} 
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                  />
                </div>
                {(item.title || item.description) && (
                  <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300'>
                    {item.title && <h3 className='text-white font-semibold text-sm mb-1'>{item.title}</h3>}
                    {item.description && <p className='text-white text-xs opacity-90 line-clamp-2'>{item.description}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className='fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4'
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className='absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10'
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          
          <div className='max-w-5xl max-h-[90vh] flex flex-col items-center' onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage.image} 
              alt={selectedImage.title || 'Gallery image'} 
              className='max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl'
            />
            {(selectedImage.title || selectedImage.description) && (
              <div className='bg-white rounded-lg p-6 mt-4 max-w-2xl'>
                {selectedImage.title && <h2 className='text-xl font-semibold text-gray-800 mb-2'>{selectedImage.title}</h2>}
                {selectedImage.description && <p className='text-gray-600'>{selectedImage.description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
