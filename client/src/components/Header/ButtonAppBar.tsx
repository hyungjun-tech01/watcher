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
import Path from "../../constants/Paths";

interface IButtonAppBar{
  path:string;
}
export default function ButtonAppBar({path}:IButtonAppBar) {
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
    <Box  sx={{ flexGrow: 1 , mb:0}}>
      <AppBar position="static" sx={{ mr:2, backgroundColor: "#19892BFF"}}>
      <Toolbar> 
          <Typography component="div" sx={{ flexGrow: 1,  }}>
            {path}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" onClick ={onClick} >Logout</Button>
          </Box>
          </Toolbar>
      </AppBar>
    </Box>
  );
}