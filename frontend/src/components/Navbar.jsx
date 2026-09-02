import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <Link to="/">Vigilance AI</Link>
      </div>
      <div className={styles.links}>
        <Link to="/" className={location.pathname === '/' ? styles.active : ''}>Home</Link>
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? styles.active : ''}>Dashboard</Link>
        <Link to="/analytics" className={location.pathname === '/analytics' ? styles.active : ''}>Analytics</Link>
      </div>
      <div className={styles.actions}>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.githubBtn}
        >
          <span>View GitHub Repository</span>
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
