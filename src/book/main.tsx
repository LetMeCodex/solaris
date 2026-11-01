import { createRoot } from 'react-dom/client';
import { Book } from './Book';
import './book.css';
import './chapters.css';
import './strip.css';

createRoot(document.getElementById('root')!).render(<Book />);
