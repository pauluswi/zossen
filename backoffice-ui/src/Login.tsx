import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';

const theme = createTheme();

interface LoginProps {
  onLoginSuccess: (token: string, username: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  // In our Mock IdP, the username determines the role.
  // supervisor -> ROLE_SUPERVISOR
  // auditor -> ROLE_AUDITOR (Conceptual)
  const [username, setUsername] = React.useState('supervisor');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the real Zossen Mock IdP
      const response = await axios.post(`/mock-idp/token?username=${username}`);
      const token = response.data.access_token;

      onLoginSuccess(token, username);
    } catch (err) {
      console.error("Login failed", err);
      setError("Authentication failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Backoffice Banking Operations
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>

            <FormControl fullWidth margin="normal">
              <InputLabel id="user-select-label">Select User (Simulates Role)</InputLabel>
              <Select
                labelId="user-select-label"
                id="user-select"
                value={username}
                label="Select User (Simulates Role)"
                onChange={(e) => setUsername(e.target.value as string)}
              >
                <MenuItem value="supervisor">Supervisor (Has ROLE_SUPERVISOR)</MenuItem>
                <MenuItem value="auditor">Auditor (Has ROLE_AUDITOR)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Password (Any value)"
              type="password"
              id="password"
              disabled
              defaultValue="password"
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
