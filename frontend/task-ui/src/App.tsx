import { StrictMode } from 'react';
import Navbar from './components/Navbar';
import TaskApp from './pages/TaskApp';
import './App.css';

function App() {
  return (
    <StrictMode>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <TaskApp />
        </div>
      </div>
    </StrictMode>
  );
}

export default App;
