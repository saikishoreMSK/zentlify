"use client"
import Link from "next/link";
// import { useState } from "react";

const AdminPage = () => {
  // const [loading,setLoading] = useState(false)
  // const handleFileUpload = async(event) => {
  //   const file = event.target.files[0];
  //   if(!file) return

  //   setLoading(true)
  //   const data = new FormData();
  //   data.append("file",file)
  //   data.append("upload_preset","zentlify_coudinary")
  //   data.append("cloud_name","dubbgtl97")

  //   const res = await fetch("https://api.cloudinary.com/v1_1/dubbgtl97/image/upload",
  //     {
  //     method:"POST",
  //     body: data
  //   })
  //   const uploadedImgURL = await res.json();
  //   console.log(uploadedImgURL.url);
  //   setLoading(false)
  // }
  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <Link href="/admin/AddProduct">Add New Product</Link>
      <Link href="/admin/ManageProducts">Manage Products</Link>
    </div>
    // <div className="upload-container">
    //   <div className="upload-icon">
    //     {
    //       loading ? "Uploading..." : <img src="upload-file.svg" alt="logo" height="60px" width="60px"/>
    //     }
        
    //   </div>
    //   <input type="file" className="file-input" onChange={handleFileUpload}>
    //   </input>
    // </div>
  );
};

export default AdminPage;
