import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Path from "../constants/Paths";
import Header from "../components/Header";
import AuditLogViewContent from "../components/AuditLogView/AuditLogViewContent";

function AuditLogView(){
  const [cookies, setCookie, removeCookie] = useCookies(['UserId','UserName', 'AuthToken']);
  const navigate = useNavigate();

  if(cookies.AuthToken === undefined
    || cookies.AuthToken === ""
    || cookies.AuthToken === null) {
      removeCookie('UserId');
      removeCookie('UserName');
      removeCookie('AuthToken');
      navigate(Path.LOGIN);
  }  

  return (
    <>
        <Header />
        <AuditLogViewContent  />
    </>
  );
}

export default AuditLogView;