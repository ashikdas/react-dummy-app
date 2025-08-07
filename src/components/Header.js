import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{ padding: '10px 20px', borderBottom: '1px solid #ccc' }}>
      <nav>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/about" style={{ marginRight: '10px' }}>About</Link>
        <Link to="/skills" style={{ marginRight: '10px' }}>Skills</Link>
        <Link to="/projects" style={{ marginRight: '10px' }}>Projects</Link>
        <Link to="/experience" style={{ marginRight: '10px' }}>Experience</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}

export default Header;
