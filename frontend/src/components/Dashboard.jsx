import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, Square } from 'lucide-react';
import styles from './Dashboard.module.css';

function Dashboard() {
  const location = useLocation();
  const { videoUrl, statusLabel, isShoplifting } = location.state || {};
  
  const [isRunning, setIsRunning] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);

  const toggleAnalysis = () => {
    setIsRunning(!isRunning);
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
              src={videoUrl} 
              className={styles.videoStream}
              autoPlay
              loop
              muted
              controls={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {isRunning && showOverlays && (
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                backgroundColor: isShoplifting ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 255, 0, 0.8)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '20px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                zIndex: 10
              }}>
                {statusLabel}
              </div>
            )}
            {isRunning && showOverlays && isShoplifting && (
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '30%',
                width: '40%',
                height: '60%',
                border: '4px solid red',
                boxShadow: '0 0 15px red',
                pointerEvents: 'none',
                zIndex: 9
              }} />
            )}
            {isRunning && showOverlays && !isShoplifting && (
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '30%',
                width: '40%',
                height: '60%',
                border: '4px solid lime',
                boxShadow: '0 0 15px lime',
                pointerEvents: 'none',
                zIndex: 9
              }} />
            )}
          </>
        ) : (
          <div className={styles.videoPlaceholder}>
            <p>No video uploaded. Please go to Home and upload a video first.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
