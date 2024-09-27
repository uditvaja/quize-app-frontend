
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizList from './components/Quiz/QuizList';
import QuizDetail from './components/Quiz/QuizDetail';
import Navigation from './components/Quiz/Navigation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScoreSummary from './components/Quiz/SubmitQuiz';
const theme = createTheme()
function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Navigation />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/quiz/:id" element={<QuizDetail />} />
          <Route path='/submit' element={<ScoreSummary/>} />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
