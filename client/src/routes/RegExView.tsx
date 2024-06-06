import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Path from "../constants/Paths";
import Header from "../components/Header/Header";
import SideBar from "../components/SideBar/SideBar";
import RegExViewContent from "../components/RegExView/RegExViewContent";
import styles from "./route.module.scss";


function RegExView(){
    const [cookies, setCookie, removeCookie] = useCookies(['WatcherWebUserId','WatcherWebUserName', 'WatcherWebAuthToken']);
    const navigate = useNavigate();
    const { t } = useTranslation();
    if(cookies.WatcherWebAuthToken === undefined
      || cookies.WatcherWebAuthToken === ""
      || cookies.WatcherWebAuthToken === null) {
        removeCookie('WatcherWebUserId');
        removeCookie('WatcherWebUserName');
        removeCookie('WatcherWebAuthToken');
        navigate(Path.LOGIN);
    }      
    return (
        <div className={styles.container}>
          <div className ={styles.sidebar}>
            <SideBar />
          </div> 
          <div className ={styles.content}>
            <Header path={t('menu.home')+' > '+t('menu.regex')}/>
            <RegExViewContent  />
          </div>
        </div>
      );
    }
    
    export default RegExView;