import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  Box,
  Alert,
  Paper,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { Pie } from 'react-chartjs-2'; // Import Pie chart from react-chartjs-2
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { styled } from '@mui/system';

ChartJS.register(ArcElement, Tooltip, Legend); // Register required chart.js components

const QuizContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  marginTop: theme.spacing(6),
  borderRadius: '15px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
  textTransform: 'none',
  borderRadius: '10px',
}));

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [isQuizStarted, setIsQuizStarted] = useState(false); // Track quiz start
  const [openWarning, setOpenWarning] = useState(true); // Modal open state
  const [correctCount, setCorrectCount] = useState(0); // Track correct answers
  const [incorrectCount, setIncorrectCount] = useState(0); // Track incorrect answers

  // Fetch quiz data
  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/quizzes/${id}`);
      setQuiz(response.data);
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  // Timer for each question
  useEffect(() => {
    if (timeLeft === 0) {
      goToNextQuestion();
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Start quiz in fullscreen mode
  const startQuiz = () => {
    setOpenWarning(false); // Close the warning modal
    setIsQuizStarted(true); // Start the quiz

    // Enter fullscreen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const handleChange = (event) => {
    setAnswers({ ...answers, [currentQuestionIndex]: parseInt(event.target.value, 10) });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(30); // Reset timer for the next question
    } else {
      handleSubmit(); // If it's the last question, submit the quiz
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/api/quizzes/${id}/submit`, {
        answers: quiz.questions.map((q, index) => answers[index]),
      });
      const result = response.data;
      setScore(result);

      // Calculate correct and incorrect answers
      const correct = result.correctAnswers.length;
      const incorrect = result.totalQuestions - correct;

      setCorrectCount(correct);
      setIncorrectCount(incorrect);

      // Exit fullscreen mode after submitting the quiz
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error submitting answers:', err);
      setSubmitError('Failed to submit answers.');
    }
  };

  if (error) return <Alert severity="error">Failed to load quiz.</Alert>;
  if (!quiz) return <CircularProgress style={{ display: 'block', margin: 'auto' }} />;

  // Generate chart data
  const chartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        label: 'Quiz Results',
        data: [correctCount, incorrectCount],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverOffset: 4,
      },
    ],
  };

  if (score) {
    return (
      <QuizContainer elevation={3}>
        <Typography variant="h4" gutterBottom>{quiz.title}</Typography>
        <Typography variant="h6" gutterBottom>
          Your Score: {score.score} / {score.totalQuestions}
        </Typography>

        {/* Chart for correct/incorrect answers */}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Quiz Results Summary
          </Typography>
          <Pie data={chartData} />
        </Box>

        <StyledButton href="/" variant="outlined" color="secondary">
          Back to Quizzes
        </StyledButton>
      </QuizContainer>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <>
      {/* Warning modal before starting the quiz */}
      <Modal
        open={openWarning}
        onClose={() => {}}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openWarning}>
          <Paper sx={{ padding: 4, textAlign: 'center', maxWidth: '500px', margin: 'auto' }}>
            <Typography variant="h5" gutterBottom>
              Warning: The Quiz is Timed!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Once you start, the quiz will enter fullscreen mode and each question will be timed.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={startQuiz}
              sx={{ marginTop: 3 }}
            >
              Start Quiz
            </Button>
          </Paper>
        </Fade>
      </Modal>

      {/* Quiz content */}
      {isQuizStarted && (
        <QuizContainer elevation={3}>
          <Typography variant="h4" gutterBottom align="center">
            {quiz.title}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            {quiz.description}
          </Typography>

          <Box my={3}>
            <Typography variant="h5" gutterBottom>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {currentQuestion.text}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={answers[currentQuestionIndex] ?? ''} onChange={handleChange}>
                {currentQuestion.choices.map((choice, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio color="primary" />}
                    label={choice}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={goToNextQuestion}
            disabled={!answers.hasOwnProperty(currentQuestionIndex)}
            fullWidth
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Submit' : 'Next'}
          </Button>

          {submitError && <Alert severity="error" sx={{ marginTop: 2 }}>{submitError}</Alert>}
        </QuizContainer>
      )}
    </>
  );
};

export default QuizDetail;
