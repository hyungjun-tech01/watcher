import React, {useState} from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import Path from "../constants/Paths";
import Header from "../components/Header/Header";
import SideBar from "../components/SideBar/SideBar";
import RegExViewContent from "../components/RegExView/RegExViewContent";
import SecurityGroupViewContent from "../components/SecurityGroupView/SecurityGroupViewContent";

import styles from "./route.module.scss";

interface TabPanelProps {
    children?: React.ReactNode; // children 타입 정의
}

const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
    return (
        <Box >
            {children}
        </Box>
    );
};

function Settings(){
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
    const [value, setValue] = useState(0);

    const handleChange = (event:any, newValue:any) => {
        setValue(newValue);
    };    
    return(
        <div className={styles.container}>
        <div className ={styles.sidebar}>
          <SideBar />
        </div> 
        <div className ={styles.content}>
          <Header path={t('menu.home')+' > '+t('menu.setting')}/>
          <Box >
            {/* Tabs 헤더 */}
            <Tabs value={value} onChange={handleChange} >
                <Tab label={t('menu.regex')}    sx={{
                    color: value === 0 ? 'white' : 'green',
                    '&.Mui-selected': { color: 'white' }, // 선택된 상태 스타일
                    }}  />
                <Tab label={t('menu.security_group')}   sx={{
                      color: value === 1 ? 'white' : 'green',
                      '&.Mui-selected': { color: 'white' }, // 선택된 상태 스타일 
                     }}/>
            </Tabs>

            {/* TabPanel 구현 */}
            {value === 0 && (
                <TabPanel>
                    <RegExViewContent  />
                </TabPanel>
            )}
            {value === 1 && (
                <TabPanel>
                    <SecurityGroupViewContent />
                </TabPanel>
            )}
        </Box>          
        </div>
        
      </div>
    );
}

export default Settings;