import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';

function Navbar() {
  return (
    <AppBar position="static" style={{ marginBottom: 20 }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          AI Marketing Assistant
        </Typography>
        <Button color="inherit" component={Link} to="/upload">Upload</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
