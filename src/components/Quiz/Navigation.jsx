
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

const Navigation = () => (
  <AppBar position="static" color="primary">
    <Container>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            Quiz App
          </Link>
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Quizzes
        </Button>
        <Button color="inherit" component={Link} to="/">
          About
        </Button>
      </Toolbar>
    </Container>
  </AppBar>
);

export default Navigation;
