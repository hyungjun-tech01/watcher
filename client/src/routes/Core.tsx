import React, { useState,  } from "react";

import {useCookies} from "react-cookie";
import {useHistory} from "react-router-dom";
import Path from "../constants/Paths";

import Header from "../components/Header";
import Content from "../components/Content";


function Core(){
  const [cookies, setCookie, removeCookie] = useCookies(['UserId','UserName', 'AuthToken']);
  const history = useHistory();

  if(cookies.AuthToken === undefined || cookies.AuthToken === "" || cookies.AuthToken === null){
      removeCookie('UserId');
      removeCookie('UserName');
      removeCookie('AuthToken');
      history.push(Path.LOGIN);
  }  

    return (
      <>
          <Header />
          <Content  />
      </>
    );
}

export default Core;