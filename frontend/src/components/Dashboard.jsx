import { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);

  const toggleAnalysis = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const endpoint = isRunning 
        ? `${apiUrl}/api/stop_analysis/` 
        : `${apiUrl}/api/start_analysis/`;
        
      const response = await fetch(endpoint, { method: 'POST' });
      if (response.ok) {
        setIsRunning(!isRunning);
      }
    } catch (error) {
      console.error('Failed to toggle analysis:', error);
      // For development frontend-only simulation:
      setIsRunning(!isRunning);
    }
  };

  const toggleOverlays = async () => {
    const newState = !showOverlays;
    setShowOverlays(newState);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/api/toggle_overlay/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ show_overlays: newState }),
      });
    } catch (error) {
      console.error('Failed to toggle overlays:', error);
    }
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
          >
            {isRunning ? (
              <><Square size={20} /> Stop Analysis</>
            ) : (
              <><Play size={20} /> Start Analysis</>
            )}
          </button>
        </div>
      </div>
      
      <div className={styles.videoWrapper}>
        {isRunning ? (
          <img 
            src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/video_feed/?overlays=${showOverlays}`} 
            alt="Live stream" 
            className={styles.videoStream}
          />
        ) : (
          <div className={styles.videoPlaceholder}>
            <p>Analysis Stopped. Click 'Start Analysis' to begin the stream.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
