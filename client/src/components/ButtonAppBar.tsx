import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { useTranslation } from 'react-i18next';
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import Path from "../constants/Paths";
import PositionedMenu from "./PositionedMenu";

export default function ButtonAppBar() {
  const { t } = useTranslation();
  const [cookies, setCookie, removeCookie] = useCookies(['WatcherWebUserId','WatcherWebUserName', 'WatcherWebAuthToken']);
  const navigate = useNavigate();
  const onClick = () => {
      removeCookie('WatcherWebUserId');
      removeCookie('WatcherWebUserName');
      removeCookie('WatcherWebAuthToken');
      navigate(Path.LOGIN);
  }
  
  if(cookies.WatcherWebAuthToken === undefined || cookies.WatcherWebAuthToken === "" || cookies.WatcherWebAuthToken === null){
    removeCookie('WatcherWebUserId');
    removeCookie('WatcherWebUserName');
    removeCookie('WatcherWebAuthToken');
    navigate(Path.LOGIN);
}
  return (
    <Box sx={{ flexGrow: 1, height: 65 }}>
      <AppBar position="static" sx={{backgroundColor: "#19892BFF"}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <PositionedMenu />
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