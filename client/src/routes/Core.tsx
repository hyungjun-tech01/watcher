import React, { useState,  } from "react";

import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import Path from "../constants/Paths";

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
      <>
          <div className={styles.container}>
            <div className ={styles.sidebar}>
              <SideBar />
            </div>
            <div className ={styles.content}>
              <Header path={'Home'}/>
              <Content  />
            </div>
          </div>
      </>
    );
}

export default Core;