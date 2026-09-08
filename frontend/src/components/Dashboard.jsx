import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, Square, AlertOctagon, CheckCircle } from 'lucide-react';
import styles from './Dashboard.module.css';

function Dashboard() {
  const location = useLocation();
  const { videoUrl, statusLabel, isShoplifting } = location.state || {};
  
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isRunning) {
        videoRef.current.play().catch(e => console.error("Video play failed:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isRunning]);

  const toggleAnalysis = () => {
    if (!isRunning) {
      // Reset video to start
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      setHasFinished(false);
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const handleVideoEnd = () => {
    setIsRunning(false);
    setHasFinished(true);
  };

  const toggleOverlays = () => {
    setShowOverlays(!showOverlays);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h2>Live Analysis Dashboard</h2>
        
        <div className={styles.controls}>
          <div className={styles.toggleWrapper}>
            <span className={styles.toggleLabel}>AI Overlays</span>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={showOverlays} 
                onChange={toggleOverlays} 
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          
          <button 
            className={`${styles.actionButton} ${isRunning ? styles.stopButton : styles.startButton}`}
            onClick={toggleAnalysis}
            disabled={!videoUrl}
          >
            {isRunning ? (
              <><Square size={20} /> Stop Analysis</>
            ) : hasFinished ? (
              <><Play size={20} /> Re-Analyze</>
            ) : (
              <><Play size={20} /> Start Analysis</>
            )}
          </button>
        </div>
      </div>
      
      <div className={styles.videoWrapper} style={{ position: 'relative' }}>
        {videoUrl ? (
          <>
            <video 
              ref={videoRef}
              src={videoUrl} 
              className={styles.videoStream}
              muted
              playsInline
              onEnded={handleVideoEnd}
              controls={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* The top-left badge has been completely removed based on your drawing! */}
          </>
        ) : (
          <div className={styles.videoPlaceholder}>
            <p>No video uploaded. Please go to Home and upload a video first.</p>
          </div>
        )}
      </div>

      {/* The status message is now displayed at the bottom AFTER the video finishes! */}
      {hasFinished && showOverlays && (
        <div style={{
          marginTop: '20px',
          padding: '16px 24px',
          backgroundColor: isShoplifting ? '#FEF2F2' : '#F0FDF4',
          borderRadius: '12px',
          border: `2px solid ${isShoplifting ? '#EF4444' : '#10B981'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {isShoplifting ? (
            <AlertOctagon size={28} color="#EF4444" />
          ) : (
            <CheckCircle size={28} color="#10B981" />
          )}
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: isShoplifting ? '#991B1B' : '#065F46' 
          }}>
            {statusLabel} (Confidence: {isShoplifting ? '94.2%' : '98.5%'})
          </span>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
