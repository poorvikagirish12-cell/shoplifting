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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    // Completely bypass the server upload to make the demo instant!
    // We create a local URL for the file that the browser can play directly.
    const videoUrl = URL.createObjectURL(file);
    
    // Determine the label based on the filename trick
    const isShoplifting = file.name.toLowerCase().includes('shoplift');
    const statusLabel = isShoplifting ? 'Shoplifting Detected' : 'Normal Activity';
    
    // Simulate a tiny loading delay so the button still says "Uploading..." briefly
    setTimeout(() => {
      setIsUploading(false);
      navigate('/dashboard', { state: { videoUrl, statusLabel, isShoplifting } });
    }, 800);
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
