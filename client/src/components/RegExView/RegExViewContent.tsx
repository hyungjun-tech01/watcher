import { Box, Modal, TextField , Typography , Stack} from '@mui/material';
import Toolbar from "@mui/material/Toolbar";
import Button from '@mui/material/Button';

import Paper from "@mui/material/Paper";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./RegExViewContent.module.scss";
import { useRecoilValue } from 'recoil';
import RegExTable from "./RegExTable";
import { RegexRepository } from '../../repository/regexRepository';
import {useCookies} from "react-cookie";


function RegExViewContent() {
    const [executeQuery, setExecuteQuery] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [value, setValue] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [t] = useTranslation();
    const { loadAllRegex, modifyRegex } = useRecoilValue(RegexRepository);
    const [cookies, setCookie, removeCookie] = useCookies(['WatcherWebUserId','WatcherWebUserName', 'WatcherWebAuthToken']);


    const handleModalClose = useCallback(()=>{
        setModalOpen(false);
    }, []);    

    const handleAddRegex = useCallback((name:string, value:string)=>{
        //aded (selectedRow)
        if (name !== undefined) {
          const newRegex = {
              action_type: 'ADD',
              regex_name : name,
              regex_value : value ,
              modify_user : cookies.WatcherWebUserId
          };
          console.log(`[ handleAddNewCompany ]`, newRegex);
          const result = modifyRegex(newRegex);
      }

      setModalOpen(false);
    }, []);    

    useEffect(() => {
        setExecuteQuery(!executeQuery);
      }, []);

    const handleAddClick = ()=>{
      setValue('');
      setName('');
      setModalOpen(true);
    };
    return (
      <>
        <div className={styles.content}>
            <Toolbar sx={{height: 40, 
                          minHeight:40,   
                          flexGrow: 1,  
                          justifyContent: "flex-end", 
                         '@media (min-width: 600px)': {
                            minHeight: 40, // This ensures the minHeight is 40px even for larger screens
                          },  
                        }} >
                <div className={styles.checkboxSearchStack} >
                <Button
                    type="submit"
                    variant="contained"
                    onClick={handleAddClick}
                    sx={{ mt: 3, mb: 2 , 
                        backgroundColor:"rgba(25,137,43,255)",
                        ":hover": { backgroundColor: "rgba(13,118,33,255)" }
                        }}
                >추가
                </Button>
              </div>
            </Toolbar>
            <Paper elevation={3} sx={{ m: 2  }}>
                <RegExTable
                  executeQuery={executeQuery}
                  setExecuteQuery={setExecuteQuery}
                />
            </Paper>
        </div>
        {/* Modal */}
        <Modal open={modalOpen} onClose={handleModalClose}>
                <Box sx={{ 
                    position: 'absolute' as 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    width: '75%',
                    p: 4, }}>
                <h2>{t('common.regex_add')}</h2>
                    <>
                      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        <TextField label={t('common.regex_name')} variant="outlined" sx={{ width: '60%' }}
                                value={name}
                                onChange = {(e)=>setName(e.target.value)}
                            />
                      </Typography>
                      <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', mt: 2 , mb: 2}}>
                          <TextField label={t('common.regex_value')} variant="outlined" sx={{ width: '60%' }}
                              value={value}
                              onChange = {(e)=>setValue(e.target.value)}
                          />
                      </Typography>
                      <Stack spacing={3} direction="row" justifyContent='flex-end'>
                          <Button variant="contained" onClick={handleModalClose}>취소</Button> 
                          <Button variant="contained" onClick={()=>handleAddRegex(name,value)}>저장</Button>
                      </Stack>
                    </>
                </Box>
            </Modal>
      </>
    );
}
export default RegExViewContent;