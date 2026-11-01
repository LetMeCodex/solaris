import { createRoot } from 'react-dom/client';
import { Book } from './Book';
import './book.css';
import './chapters.css';
import './strip.css';
import './story.css';

createRoot(document.getElementById('root')!).render(<Book />);
