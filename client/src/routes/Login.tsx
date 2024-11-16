import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { apiLoginValidate } from "../api/user";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Path from "../constants/Paths";

const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
        Watcher-Web &nbsp;
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};


const createMessage = (error: IError) => {
  if (!error) {
    return error;
  }
  switch (error.message) {
    case "Invalid email or password":
      return {
        ...error,
        type: "error",
        content: "common.invalidEmailOrUsername",
      };
    case "Failed to fetch":
      return {
        ...error,
        type: "warning",
        content: "common.serverConnectionFailed",
      };
    case "Network request failed":
      return {
        ...error,
        type: "warning",
        content: "common.noInternetConnection",
      };
    default:
      return {
        ...error,
        type: "warning",
        content: "common.unknownError",
      };
  }
};

interface IError {
  message: string;
  type: string;
  content: string;
}

const initErrorContent: IError = { message: "", type: "", content: "" };

const Login = () => {
  const { t } = useTranslation();
  const [cookies, setCookie, removeCookie] = useCookies([
    "WatcherWebUserId",
    "WatcherWebUserName",
    "WatcherWebAuthToken",
  ]);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<IError>(initErrorContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const user_data = {
        email: data.get("email"),
        password: data.get("password"),
      };
      onValid(user_data);
    },
    []
  );

  const onMessageDismiss = () => {
    setLoginError(initErrorContent);
  };
  const onValid = async (data: any) => {
    setIsSubmitting(true);
    const response = await apiLoginValidate(data);

    if (response.message) {
      setLoginError(createMessage(response));
      removeCookie("WatcherWebUserId");
      removeCookie("WatcherWebUserName");
      removeCookie("WatcherWebAuthToken");
    } else {
      setCookie("WatcherWebUserId", response.userId);
      setCookie("WatcherWebUserName", response.userName);
      setCookie("WatcherWebAuthToken", response.token);
      navigate(Path.ROOT);
    }
    setIsSubmitting(false);
  };
  const defaultTheme = createTheme();
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" sx={{ fontWeight: 'bold' }} variant="h4">
            {t('common.applicationTitle')}
          </Typography>
          <Typography component="h1" sx={{ fontWeight: 'bold' }} variant="h4">
            {t('common.applicationName')}
          </Typography>
          <Typography component="h1" variant="h6" sx={{ fontWeight: 'bold', marginTop: 4 }}>
            {t('common.login')}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="User Id"
              name="email"
              autoComplete="email"
              autoFocus
              onClick={onMessageDismiss}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              helperText= {t(loginError.content)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 , 
                   backgroundColor:"#19892BFF",
                   ":hover": { backgroundColor: "#0D7621FF" }
                  }}
            >
              {t("action.Login")}
            </Button>
            <Grid container>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};
export default Login;
