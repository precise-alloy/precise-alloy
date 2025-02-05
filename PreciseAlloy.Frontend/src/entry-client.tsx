import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

const container = document.getElementById('app');
if (container) {
  ReactDOM.hydrateRoot(
    container,
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
