import React, { useState,  } from "react";

import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import Path from "../constants/Paths";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import Header from "../components/Header/Header";
import SideBar from "../components/SideBar/SideBar";
import Content from "../components/Content";
import styles from "./route.module.scss";

function Core(){
  const [cookies, setCookie, removeCookie] = useCookies(['WatcherWebUserId','WatcherWebUserName', 'WatcherWebAuthToken']);
  const navigate = useNavigate();

  if(cookies.WatcherWebAuthToken === undefined || cookies.WatcherWebAuthToken === "" || cookies.WatcherWebAuthToken === null){
      removeCookie('WatcherWebUserId');
      removeCookie('WatcherWebUserName');
      removeCookie('WatcherWebAuthToken');
      navigate(Path.LOGIN);
  }  

    return (
      <Container>
        <div className={styles.container}>
          <Grid container>  
            <Grid item xs={2}>
              <SideBar />
            </Grid> 
            <Grid item xs={10}>
              <Header path={'Home'}/>
              <Content  />
            </Grid>
          </Grid>
        </div>
      </Container>
    );
}

export default Core;