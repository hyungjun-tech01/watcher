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
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
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
      <Link color="inherit" href="https://mui.com/">
        Watch-Web
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const createMessage = (error: IError) => {
  if (!error) {
    return error;
  }
  console.log("createMessage", error.message);
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
        content: "common.noInternetConnection",
      };
    case "Network request failed":
      return {
        ...error,
        type: "warning",
        content: "common.serverConnectionFailed",
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
    "UserId",
    "UserName",
    "AuthToken",
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
      removeCookie("UserId");
      removeCookie("UserName");
      removeCookie("AuthToken");
    } else {
      setCookie("UserId", response.userId);
      setCookie("UserName", response.userName);
      setCookie("AuthToken", response.token);
      navigate(Path.ROOT);
    }
    setIsSubmitting(false);
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
export default Login;
