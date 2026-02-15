import { v2 as cloudinary } from "cloudinary";
import galleryModel from "../models/galleryModel.js";

// API to upload gallery images (Admin only) - supports multiple images
const uploadGalleryImage = async (req, res) => {
    try {
        const { title, description } = req.body;
        const imageFiles = req.files;

        if (!imageFiles || imageFiles.length === 0) {
            return res.json({ success: false, message: "At least one image is required" });
        }

        const uploadedItems = [];

        // Upload each image to Cloudinary and save to database
        for (const imageFile of imageFiles) {
            // Upload image to Cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { 
                resource_type: "image",
                folder: "prescripto_gallery"
            });
            const imageUrl = imageUpload.secure_url;

            // Create gallery item in database
            const galleryData = {
                image: imageUrl,
                title: title || '',
                description: description || '',
                date: Date.now()
            };

            const newGalleryItem = await galleryModel.create(galleryData);
            uploadedItems.push(newGalleryItem);
        }

        res.json({ 
            success: true, 
            message: `${uploadedItems.length} image(s) uploaded successfully`,
            galleryItems: uploadedItems
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all gallery images (Public)
const getAllGalleryImages = async (req, res) => {
    try {
        const galleryItems = await galleryModel.find({});
        res.json({ success: true, galleryItems });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to delete gallery image (Admin only)
const deleteGalleryImage = async (req, res) => {
    try {
        const { imageId } = req.body;

        if (!imageId) {
            return res.json({ success: false, message: "Image ID is required" });
        }

        const galleryItem = await galleryModel.findByIdAndDelete(imageId);

        if (!galleryItem) {
            return res.json({ success: false, message: "Gallery image not found" });
        }

        // Optionally delete from Cloudinary
        // Extract public_id from the URL and delete
        // const publicId = galleryItem.image.split('/').slice(-2).join('/').split('.')[0];
        // await cloudinary.uploader.destroy(publicId);

        res.json({ 
            success: true, 
            message: "Gallery image deleted successfully" 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { uploadGalleryImage, getAllGalleryImages, deleteGalleryImage };
