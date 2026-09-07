import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import styles from './Analytics.module.css';

function Analytics() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/download_report/`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Create a blob from the response and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'incident_report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Is the backend running?');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.header}>
        <h2>Incident Analytics</h2>
        <p>Review and export data for detected anomalies.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <FileText size={24} className={styles.icon} />
            <h3>Export Data</h3>
          </div>
        </div>
        <div className={styles.cardBody}>
          <p>
            Download a comprehensive CSV report containing timestamps, confidence scores, 
            and camera IDs for all detected shoplifting incidents.
          </p>
          <button 
            className={styles.downloadButton}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download size={20} />
            {isDownloading ? 'Downloading...' : 'Download Incident Report'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
