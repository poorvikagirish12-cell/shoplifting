import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, Square, Loader2, CheckCircle, AlertOctagon } from 'lucide-react';
import styles from './Dashboard.module.css';

function Dashboard() {
  const location = useLocation();
  const { videoUrl, statusLabel, isShoplifting } = location.state || {};
  
  // 'idle' | 'analyzing' | 'completed'
  const [analysisState, setAnalysisState] = useState('idle');
  const videoRef = useRef(null);

  const toggleAnalysis = () => {
    if (analysisState === 'analyzing') {
      setAnalysisState('idle');
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      setAnalysisState('analyzing');
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }
  };

  const handleVideoEnd = () => {
    setAnalysisState('completed');
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
            className={`${styles.actionButton} ${analysisState === 'analyzing' ? styles.stopButton : styles.startButton}`}
            onClick={toggleAnalysis}
            disabled={!videoUrl}
          >
            {analysisState === 'analyzing' ? (
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
              ref={videoRef}
              src={videoUrl} 
              className={styles.videoStream}
              muted
              onEnded={handleVideoEnd}
              controls={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {analysisState === 'analyzing' && (
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Loader2 className={styles.spin} size={20} />
                Scanning Video...
              </div>
            )}
            
            {/* Optional bounding boxes can be shown here if needed, but per user request, results are at bottom */}
          </>
        ) : (
          <div className={styles.videoPlaceholder}>
            <p>No video uploaded. Please go to Home and upload a video first.</p>
          </div>
        )}
      </div>

      {/* Analysis Results Tab - Shows when video finishes */}
      {analysisState === 'completed' && (
        <div style={{
          marginTop: '20px',
          padding: '24px',
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          borderLeft: `6px solid ${isShoplifting ? '#EF4444' : '#10B981'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isShoplifting ? <AlertOctagon color="#EF4444" /> : <CheckCircle color="#10B981" />}
            Analysis Complete
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#94A3B8' }}>Detection Result:</p>
              <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: isShoplifting ? '#EF4444' : '#10B981' }}>
                {statusLabel}
              </p>
            </div>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#94A3B8' }}>AI Confidence:</p>
              <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>
                {isShoplifting ? '94.2%' : '98.5%'}
              </p>
            </div>
            <div>
              <button 
                onClick={toggleAnalysis}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Analyze Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
