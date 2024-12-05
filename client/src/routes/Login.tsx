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
  Link,
} from "@mui/material";
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Path from "../constants/Paths";
import ForgotPassword from './ForgotPassword';

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
    case "Invalid userName or password":
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
    case "No Security Admin":
        return {
          ...error,
          type: "warning",
          content: "common.noSecurityAdmin",
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
  const [forgotPassword, setForgotPassword] = React.useState(false);

  const handleClickForgotPasswordOpen= () => {
    const usernameInput = document.getElementById("username") as HTMLInputElement;
    if (usernameInput) {
      usernameInput.value = ""; // 값 초기화
    }
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    if (passwordInput) {
      passwordInput.value = ""; // 값 초기화
    }
    setForgotPassword(true);
  };
  const handleClickForgotPasswordClose= () => {
    setForgotPassword(false);
  };  

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const user_data = {
        username: data.get("username"),
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
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3,  width: '100%' }}>
            <Box display="flex" alignItems="center"  sx={{ mb: 2,   gap: 2 }}>
              <Typography variant="body1" component="label" htmlFor="email" sx={{ minWidth: 90, whiteSpace: 'nowrap' }}>
                {t('common.userId')}
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                name="username"
                autoComplete="username"
                autoFocus
                onClick={onMessageDismiss}
              />
            </Box>
            <Box display="flex" alignItems="center"  sx={{ mb: 2,   gap: 2 }}>
              <Typography variant="body1" component="label" htmlFor="password" sx={{ minWidth: 90, whiteSpace: 'nowrap' }}>
                {t('common.password')}
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                helperText= {t(loginError.content)}
              />
            </Box>            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 , 
                   height: "50px", 
                   backgroundColor:"#19892BFF",
                   ":hover": { backgroundColor: "#0D7621FF" }
                  }}
            >
              {t("action.Login")}
            </Button>
           {/* 비밀번호 잊어 버렸을 떄 Proces 막음 */}
            <Grid container  justifyContent="center">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                }}
              >
                <Link
                  component="button"
                  type="button"
                  onClick={handleClickForgotPasswordOpen}
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  <Typography variant="body1" component="label" htmlFor="forgotUserPassword" sx={{ minWidth: 90, whiteSpace: 'nowrap' }}>
                    {t('common.forgotUserPassword')}
                  </Typography>
                </Link>  
              </Box>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
      <ForgotPassword open={forgotPassword} handleClose={handleClickForgotPasswordClose} />
    </ThemeProvider>
  );
};
export default Login;
