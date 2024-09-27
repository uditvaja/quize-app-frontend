import React from 'react';
import { Button, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import { Pie } from 'react-chartjs-2';

const QuizSummary = ({ title, score, totalQuestions, correctAnswers, incorrectAnswers, questions }) => {
  const correctCount = correctAnswers.length;
  const incorrectCount = incorrectAnswers.length;

  // Calculate percentages
  const correctPercentage = ((correctCount / totalQuestions) * 100).toFixed(2);
  const incorrectPercentage = ((incorrectCount / totalQuestions) * 100).toFixed(2);

  // Chart data
  const chartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        label: 'Quiz Results',
        data: [correctCount, incorrectCount],
        backgroundColor: ['#4caf50', '#f44336'], // Green for correct, red for incorrect
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      <Typography variant="h6" gutterBottom>
        Your Score: {score} / {totalQuestions}
      </Typography>

      {/* Pie Chart for correct/incorrect answers */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Quiz Results Summary</Typography>
        <Pie data={chartData} />
      </Box>

      {/* Display percentages */}
      <Box mt={2}>
        <Typography variant="h6">
          Correct: {correctPercentage}% ({correctCount} out of {totalQuestions})
        </Typography>
        <Typography variant="h6">
          Incorrect: {incorrectPercentage}% ({incorrectCount} out of {totalQuestions})
        </Typography>
      </Box>

      {/* Detailed report of correct and incorrect answers */}
      <Box mt={4}>
        <Typography variant="h5">Detailed Answer Report</Typography>
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <List>
            {questions.map((question, index) => {
              const isCorrect = correctAnswers.includes(index);
              return (
                <ListItem key={index} sx={{ backgroundColor: isCorrect ? '#e8f5e9' : '#ffebee', mb: 1 }}>
                  <ListItemText
                    primary={`Q${index + 1}: ${question.text}`}
                    secondary={`Your answer: ${question.choices[question.userAnswer]} ${
                      isCorrect ? '(Correct)' : '(Incorrect)'
                    }`}
                  />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </Box>

      <Button href="/" variant="outlined" color="secondary" sx={{ mt: 4 }}>
        Back to Quizzes
      </Button>
    </Box>
  );
};

export default QuizSummary;
