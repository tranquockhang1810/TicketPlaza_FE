'use client'

import { UploadButton } from "@/src/utils/uploadthing";

const UploadImg = () => {
  return(
    <>
      <UploadButton 
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
        }}
        onUploadError={(error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </>
  )
}

export default UploadImg;