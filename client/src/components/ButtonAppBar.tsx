import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import {useCookies} from "react-cookie";
import {useHistory} from "react-router-dom";
import Path from "../constants/Paths";

export default function ButtonAppBar() {
  const { t } = useTranslation();
  const [cookies, setCookie, removeCookie] = useCookies(['UserId','UserName', 'AuthToken']);
  const history = useHistory();
  const onClick = () => {
      removeCookie('UserId');
      removeCookie('UserName');
      removeCookie('AuthToken');
      history.push(Path.LOGIN);
  }
  
  if(cookies.AuthToken === undefined || cookies.AuthToken === "" || cookies.AuthToken === null){
    removeCookie('UserId');
    removeCookie('UserName');
    removeCookie('AuthToken');
    history.push(Path.LOGIN);
}

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('common.productName')}
          </Typography>
          <Button color="inherit" onClick ={onClick}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}