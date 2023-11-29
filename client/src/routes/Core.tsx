import React, { useState,  } from "react";

import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import Path from "../constants/Paths";

import Header from "../components/Header";
import Content from "../components/Content";


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
          <Header />
          <Content  />
      </>
    );
}

export default Core;