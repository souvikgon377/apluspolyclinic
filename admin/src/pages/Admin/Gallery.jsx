import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Gallery = () => {

    const [images, setImages] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [galleryItems, setGalleryItems] = useState([])
    const [loading, setLoading] = useState(false)

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    // Fetch all gallery items
    const fetchGalleryItems = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/gallery')
            if (data.success) {
                setGalleryItems(data.galleryItems)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchGalleryItems()
    }, [])

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 10) {
            toast.error('Maximum 10 images allowed at once')
            return
        }
        setImages(files)
    }

    const removeImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (!images || images.length === 0) {
                return toast.error('Please select at least one image')
            }

            setLoading(true)

            const formData = new FormData()
            images.forEach((image) => {
                formData.append('images', image)
            })
            formData.append('title', title)
            formData.append('description', description)

            const { data } = await axios.post(backendUrl + '/api/admin/upload-gallery', formData, { headers: { authorization: 'Bearer ' + aToken } })

            if (data.success) {
                toast.success(data.message)
                setImages([])
                setTitle('')
                setDescription('')
                fetchGalleryItems()
                // Reset file input
                document.getElementById('doc-img').value = ''
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    const deleteImage = async (imageId) => {
        try {
            if (!window.confirm('Are you sure you want to delete this image?')) {
                return
            }

            setDeletingId(imageId)
            const { data } = await axios.post(backendUrl + '/api/admin/delete-gallery', { imageId }, { headers: { authorization: 'Bearer ' + aToken } })

            if (data.success) {
                toast.success(data.message)
                fetchGalleryItems()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className='w-full max-w-6xl mx-auto px-4'>
            <h1 className='text-3xl font-bold text-gray-800 mb-8'>Gallery Management</h1>

            {/* Upload Form */}
            <div className='bg-white rounded-xl shadow-md border border-gray-100 p-8 mb-10'>
                <h2 className='text-xl font-semibold text-gray-800 mb-6'>Upload New Images (Max 10)</h2>
                <form onSubmit={onSubmitHandler}>
                    <div className='space-y-6'>
                        {/* File Input */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Select Images
                            </label>
                            <label htmlFor='doc-img' className='cursor-pointer block'>
                                <div className='w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-colors'>
                                    <div className='text-center'>
                                        <svg className='w-12 h-12 mx-auto text-gray-400 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                        </svg>
                                        <p className='text-sm text-gray-600'>Click to select multiple images</p>
                                        <p className='text-xs text-gray-400 mt-1'>PNG, JPG up to 10 files</p>
                                    </div>
                                </div>
                            </label>
                            <input 
                                onChange={handleImageChange} 
                                type="file" 
                                id="doc-img" 
                                hidden 
                                accept="image/*"
                                multiple
                            />
                        </div>

                        {/* Image Previews */}
                        {images.length > 0 && (
                            <div>
                                <p className='text-sm font-medium text-gray-700 mb-3'>
                                    Selected Images ({images.length})
                                </p>
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                    {images.map((image, index) => (
                                        <div key={index} className='relative group'>
                                            <img 
                                                src={URL.createObjectURL(image)} 
                                                alt={`Preview ${index + 1}`} 
                                                className='w-full h-32 object-cover rounded-lg border border-gray-200'
                                            />
                                            <button 
                                                type='button'
                                                onClick={() => removeImage(index)}
                                                className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600'
                                            >
                                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Optional Details */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Image Title (Optional)
                                </label>
                                <input 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    value={title} 
                                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent' 
                                    type="text" 
                                    placeholder='Enter image title'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Description (Optional)
                                </label>
                                <input 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    value={description} 
                                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent' 
                                    type="text" 
                                    placeholder='Enter image description'
                                />
                            </div>
                        </div>

                        <button 
                            type='submit' 
                            disabled={loading || images.length === 0}
                            className='w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                        >
                            {loading ? 'Uploading...' : `Upload ${images.length} Image${images.length !== 1 ? 's' : ''}`}
                        </button>
                    </div>
                </form>
            </div>

            {/* Gallery Grid */}
            <div className='bg-white rounded-xl shadow-md border border-gray-100 p-8'>
                <h2 className='text-xl font-semibold text-gray-800 mb-6'>Gallery Images ({galleryItems.length})</h2>
                
                {galleryItems.length === 0 ? (
                    <div className='text-center py-12 text-gray-500'>
                        <img src={assets.upload_area} alt="" className='w-24 h-24 mx-auto opacity-50 mb-4' />
                        <p>No images uploaded yet</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {galleryItems.map((item, index) => (
                            <div key={index} className='relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100'>
                                <img 
                                    src={item.image} 
                                    alt={item.title || 'Gallery image'} 
                                    className='w-full h-64 object-cover'
                                />
                                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center'>
                                    <button 
                                        onClick={() => deleteImage(item._id)}
                                        disabled={deletingId === item._id}
                                        className='opacity-0 group-hover:opacity-100 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all transform scale-90 group-hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                                    >
                                        {deletingId === item._id ? (
                                            <>
                                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete'
                                        )}
                                    </button>
                                </div>
                                {(item.title || item.description) && (
                                    <div className='p-4 bg-white'>
                                        {item.title && <h3 className='font-semibold text-gray-800 mb-1'>{item.title}</h3>}
                                        {item.description && <p className='text-sm text-gray-600'>{item.description}</p>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Gallery
