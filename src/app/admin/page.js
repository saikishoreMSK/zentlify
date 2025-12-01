// src/app/admin/page.js
"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react"; // <-- NEW IMPORTS
import { useRouter } from "next/navigation"; // <-- NEW IMPORT
import AddProduct from "./AddProduct/page"; 
import ManageProducts from "./ManageProducts/page"; 
import Loader from "@/components/Loader";
import { useEffect } from "react";
import './admin.css';

const AdminPage = () => {
  const [activeComponent, setActiveComponent] = useState("addProduct");
  
  // Get the session status and data
  const { data: session, status } = useSession();
  const router = useRouter();


  const [showLoader, setShowLoader] = useState(true);
    const [showVideo, setShowVideo] = useState(false);
  
    useEffect(() => {
      const loaderTimer = setTimeout(() => {
        setShowLoader(false);
        setShowVideo(true); // Show video after loader
      }, 1000); 
  
      return () => clearTimeout(loaderTimer); 
    }, []);
    useEffect(() => {
      if (showVideo) {
        // Timer for video (e.g., 3 seconds)
        const videoTimer = setTimeout(() => {
          setShowVideo(false); // Hide video after playback
        }, 2000); // Adjust the duration to match the video length
  
        return () => clearTimeout(videoTimer); // Cleanup video timer
      }
    }, [showVideo]);

  // 1. Handle Loading State
  
if (status === "loading") {
  return (
    <>
      {showLoader ? (
        <Loader />
      ) : showVideo ? (
        <div className="video-container">
          <video
            src="/zentlify-logo.mp4"
            autoPlay
            muted
            className="logo-video"
          />
        </div>
      ) : null}
    </>
  );
}


  // 2. Handle Unauthenticated State (Fallback, should be caught by middleware)
  // We check the role here just in case the middleware was bypassed or for extra security.
  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    // Redirect to login page if not signed in or not an admin
    // The middleware should already handle this, but this protects the client component.
    router.push('/login');
    return null; // Don't render anything while redirecting
  }


  // 3. Render the Dashboard (only runs if status is 'authenticated' and role is 'admin')
  return (
    <div className="admin-panel">
      
      <div className="flex items-center justify-between p-4 bg-gray-100 shadow-md">
        <h1 className="text-2xl font-bold">Welcome, {session.user.name || 'Admin'}</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/' })} // Sign out and redirect to home page
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150"
        >
          Sign Out
        </button>
      </div>
      
      {/* Navbar */}
      <div className="navbar">
        <button
          className={activeComponent === "addProduct" ? "active" : ""}
          onClick={() => setActiveComponent("addProduct")}
        >
          Add Products
        </button>
        <button
          className={activeComponent === "manageProducts" ? "active" : ""}
          onClick={() => setActiveComponent("manageProducts")}
        >
          Manage Products
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeComponent === "addProduct" && <AddProduct />}
        {activeComponent === "manageProducts" && <ManageProducts />}
      </div>
    </div>
  );
};

export default AdminPage;
