
import React from 'react';
import { List, ListItem, ListItemText, Typography, Card, CardContent, Box } from '@mui/material';

const ScoreSummary = ({ scoreData }) => {
  if (!scoreData || !scoreData.correctAnswers || !Array.isArray(scoreData.correctAnswers)) {
    return <Typography color="error">Something went wrong. Unable to display score summary.</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 5, p: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Quiz Completed!
        </Typography>
        <Typography variant="h6">
          Your Score: {scoreData.score} / {scoreData.totalQuestions}
        </Typography>
        <Box my={2}>
          <Typography variant="h5" gutterBottom>
            Correct Answers:
          </Typography>
          <List>
            {scoreData.correctAnswers.map((correctAnswer, index) => (
              <ListItem key={index} sx={{ backgroundColor: '#f5f5f5', mb: 1, borderRadius: 2 }}>
                <ListItemText
                  primary={`Question ${index + 1}: ${correctAnswer}`}
                  primaryTypographyProps={{ variant: 'body1', color: 'primary' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScoreSummary;
