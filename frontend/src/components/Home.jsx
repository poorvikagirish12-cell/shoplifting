import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import styles from './Home.module.css';

function Home() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    // Create FormData to send to Django
    const formData = new FormData();
    formData.append('video', file);

    try {
      // In production this points to your Django backend
      // For now we'll simulate the API call, and later connect it to the real backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/upload_video/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Redirect to dashboard after successful upload
        navigate('/dashboard');
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Network error during upload:', error);
      // For development purposes while backend isn't ready:
      navigate('/dashboard');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Vigilance AI</h1>
        <p className={styles.subtitle}>
          Advanced Real-time Shoplifting Detection powered by YOLOv8.
        </p>
        
        <div className={styles.uploadSection}>
          <button 
            className={styles.uploadButton} 
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            <UploadCloud size={24} />
            {isUploading ? 'Uploading...' : 'Upload Video / Try Live Demo'}
          </button>
          <input
            type="file"
            accept="video/mp4"
            ref={fileInputRef}
            onChange={handleFileChange}
            className={styles.hiddenInput}
          />
          <p className={styles.uploadHint}>Supports MP4 files up to 50MB</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
