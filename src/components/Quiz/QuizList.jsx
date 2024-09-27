
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';


const QuizCard = styled(Card)(({ theme }) => ({
  marginBottom: '20px',
  borderRadius: '15px',
  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column', // Column layout to place items vertically
  justifyContent: 'space-between', // Ensures the button stays at the bottom
  minHeight: '300px', // Ensures consistent card height
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: 'bold',
  color: theme.palette.primary.dark,
}));

const Description = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  flexGrow: 1, // Allows the description to take up available space
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3, // Limit to 3 lines and add ellipsis for overflow text
  WebkitBoxOrient: 'vertical',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '1.1rem',
  padding: theme.spacing(1.5),
  borderRadius: '10px',
  marginTop: 'auto', // Pushes the button to the bottom of the card
}));

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/quizzes');
      setQuizzes(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  if (loading)
    return <CircularProgress style={{ display: 'block', margin: 'auto' }} />;
  if (error) return <Alert severity="error">Failed to load quizzes.</Alert>;

  return (
    <Paper elevation={4} sx={{ padding: 6, marginTop: 6, borderRadius: '20px' }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        Available Quizzes
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {quizzes.map((quiz) => (
          <Grid item key={quiz._id} xs={12} sm={6} md={4}>
            <QuizCard>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Title gutterBottom>{quiz.title}</Title>
                <Description>{quiz.description}</Description>
                <Link to={`/quiz/${quiz._id}`} style={{ textDecoration: 'none' }}>
                  <StyledButton variant="contained" fullWidth color="primary">
                    Take Quiz
                  </StyledButton>
                </Link>
              </CardContent>
            </QuizCard>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default QuizList;
