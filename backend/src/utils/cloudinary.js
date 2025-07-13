import {v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { response } from 'express'

//configuration

cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary  = async (LocalFilePath) => {
    try{
        if(!LocalFilePath)
            return null;
        const response = await cloudinary.uploader.upload(LocalFilePath, {
            resource_type: "auto"
        })

        fs.unlinkSync(LocalFilePath)
        return response
    }
     catch (error) {
    try {
      fs.unlinkSync(LocalFilePath);
    } catch (delErr) {
      console.error("Failed to delete file:", delErr);
    }
    return null;
  }

}


const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const fileName = parts.at(-1); // "abc123.jpg"
  const publicId = fileName.split(".")[0]; // "abc123"
  return publicId; // assuming folder name is "products"
};

 const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return null;
    const publicId = getPublicIdFromUrl(imageUrl);
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};
export {uploadOnCloudinary,deleteFromCloudinary}


