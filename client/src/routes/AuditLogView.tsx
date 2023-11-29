import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Path from "../constants/Paths";
import Header from "../components/Header";
import AuditLogViewContent from "../components/AuditLogView/AuditLogViewContent";

function AuditLogView(){
  const [cookies, setCookie, removeCookie] = useCookies(['WatcherWebUserId','WatcherWebUserName', 'WatcherWebAuthToken']);
  const navigate = useNavigate();

  if(cookies.WatcherWebAuthToken === undefined
    || cookies.WatcherWebAuthToken === ""
    || cookies.WatcherWebAuthToken === null) {
      removeCookie('WatcherWebUserId');
      removeCookie('WatcherWebUserName');
      removeCookie('WatcherWebAuthToken');
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