import React, { useState, useCallback, useEffect } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Paper, Box , Typography, Toolbar, Button} from '@mui/material';
import { useTranslation } from "react-i18next";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import styles from "./SecurityGroupViewContent.module.scss";
import { SecurityGroupRepository } from '../../repository/securityGroupRepository';
import { atomsSecurityGroupData, atomsSecurityGroupAdminData, atomsSecurityGroupDeptData, 
         ISecurityGroup, ISecurityGroupAdmin, ISecurityGroupDept } from '../../atoms/atomsSecurityGroup';
import { useRecoilValue } from 'recoil';
import {useCookies} from "react-cookie";

import AddSecurityGroup from './AddSecurityGroup';
import AddSecurityAdmin from './AddSecurityAdmin';
import AddSecurityDept from './AddSecurityDept';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const createMessage = (error: IError) => {
    if (!error) {
      return error;
    }

    switch (error.message) {
      case "Not Admin":
        return {
            ...error,
            type: "warning",
            content: "common.only_security_group_admin",
        };   
      case "exists Security Group Admin":
        return {
          ...error,
          type: "error",
          content: "common.exist_security_admin",
        };
      case "exists Security Group Dept":
        return {
          ...error,
          type: "warning",
          content: "common.exists_security_dept",
        };
      case "No Select Security Group":
        return {
              ...error,
              type: "warning",
              content: "common.no_select_security_group",
        };        
      default:
        return {
              ...error,
              type: "warning",
              content: "common.unknownError",
        };    
    }
  };
  
  interface IError {
    message: string;
    type: string;
    content: string;
  }
  
  const initErrorContent: IError = { message: "", type: "", content: "" };


function SecurityGroupViewContent(){
    const [t] = useTranslation();
    const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
    const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
    const [selectedDept, setSelectedDept] = useState<string | null>(null);
    const { loadSecurityGroup, loadSecurityGroupAdmin, loadSecurityGroupDept, 
            modifySecurityGroup, modifySecurityGroupDept , modifySecurityGroupAdmin} = useRecoilValue(SecurityGroupRepository);
    const [cookies, setCookie, removeCookie] = useCookies(['WatcherWebUserId','WatcherWebUserName', 'WatcherWebAuthToken']);
    const [executeQuery, setExecuteQuery] = useState(true);
    const [executeAdminQuery, setExecuteAdminQuery]  = useState(true);
    const securityGroupData = useRecoilValue(atomsSecurityGroupData);
    const securityGroupAdminData = useRecoilValue(atomsSecurityGroupAdminData);
    const securityGroupDeptData = useRecoilValue(atomsSecurityGroupDeptData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<IError>(initErrorContent);   

    const [addSecurityGroup, setAddSecurityGroup] = useState(false);
    const [addSecurityAdmin, setAddSecurityAdmin] = useState(false);
    const [addSecurityDept, setAddSecurityDept] = useState(false);

    const handleClickAddSecurityOpen= () => {
        setError(initErrorContent);
        const usernameInput = document.getElementById("username") as HTMLInputElement;
        if (usernameInput) {
          usernameInput.value = ""; // 값 초기화
        }
        const passwordInput = document.getElementById("password") as HTMLInputElement;
        if (passwordInput) {
          passwordInput.value = ""; // 값 초기화
        }
        setAddSecurityGroup(true);
      };
  
      const handleClickAddSecurityClose= () => {
        setAddSecurityGroup(false);
      };  

      const handleClickAddSecurityDeptOpen= () => {
        setError(initErrorContent);
        if(!selectedInterest){
            const checkSecurityGroup: IError = { message: "", type: "warning", content: "common.no_select_security_group" };
            setError(checkSecurityGroup);
            return;
        }
        const deptnameInput = document.getElementById("security_dept_name") as HTMLInputElement;
        if (deptnameInput) {
            deptnameInput.value = ""; // 값 초기화
        }
        setAddSecurityDept(true);
      };      
      const handleClickAddSecurityDeptClose= () => {
        setAddSecurityDept(false);
      };       

      const handleClickAddSecurityAdminOpen= () => {
        setError(initErrorContent);
        if(!selectedInterest){
            const checkSecurityGroup: IError = { message: "", type: "warning", content: "common.no_select_security_group" };
            setError(checkSecurityGroup);
            return;
        }
        const adminnameInput = document.getElementById("security_admin_name") as HTMLInputElement;
        if (adminnameInput) {
            adminnameInput.value = ""; // 값 초기화
        }
        setAddSecurityAdmin(true);
      };      
      const handleClickAddSecurityAdminClose= () => {
        setAddSecurityAdmin(false);
      };    

    const handleSelect = (option: ISecurityGroup) => {
      setError(initErrorContent);
      setSelectedInterest(option.security_group_name);
      
      const data = {username : cookies.WatcherWebUserName, security_group_name:option.security_group_name};
      loadSecurityGroupAdmin(data);
      loadSecurityGroupDept(data);    
    };    
    const handleSelectManager = (option:ISecurityGroupAdmin) =>{
        setError(initErrorContent);
        setSelectedAdmin(option.security_group_admin_name);
    }
    const handleSelectDept = (option:ISecurityGroupDept) =>{
        setError(initErrorContent);
        setSelectedDept(option.dept_name);
    }

    const querySecurityGroup = useCallback(()=>{
        setError(initErrorContent);
        const data = {username : cookies.WatcherWebUserName, security_group_name:''};
        loadSecurityGroup(data);
        setSelectedInterest(null);
        loadSecurityGroupAdmin(data);
        setSelectedAdmin(null);
        loadSecurityGroupDept(data);
        setSelectedDept(null);
    }, [executeQuery]);    

    const querySecurityGroupAdmin = useCallback(()=>{
        setError(initErrorContent);
        const data = {username : cookies.WatcherWebUserName, security_group_name:selectedInterest};
        loadSecurityGroupAdmin(data);
        setSelectedAdmin(null);
    }, [executeAdminQuery]);    

    useEffect(() => {
        querySecurityGroup();
        querySecurityGroupAdmin();
        setExecuteQuery(!executeQuery);
        setExecuteAdminQuery(!executeAdminQuery);
    }, []);

    const deleteSecurityGroup =  () => {
           setError(initErrorContent);
           const _data = {
            action_type : 'DELETE',
            security_group_name: selectedInterest,
            modify_user : cookies.WatcherWebUserId,
          };
          onDeleteSecurityGroup(_data);
    };
    const onDeleteSecurityGroup = async (data: any) => {
        setIsSubmitting(true);
        const response = await modifySecurityGroup(data);
        if (response.message === 'success') {
            querySecurityGroup();   
        } else {
          setError(createMessage(response));
        }
        setIsSubmitting(false);
    };      
      
    const deleteSecurityGroupDept =  () => {
        setError(initErrorContent);
        const _data = {
         action_type : 'DELETE',
         security_group_name: selectedInterest,
         security_dept_name : selectedDept,
       };
       onDeleteSecurityGroupDept(_data);
    };
    const onDeleteSecurityGroupDept = async (data: any) => {
     setIsSubmitting(true);
     const response = await modifySecurityGroupDept(data);
     if (response.message === 'success') {
        const data = {username : cookies.WatcherWebUserName, security_group_name:selectedInterest};
        loadSecurityGroupDept(data);   
     } else {
       setError(createMessage(response));
     }
     setIsSubmitting(false);
    };
   
    const deleteSecurityGroupAdmin =  () => {
      setError(initErrorContent);
      const _data = {
        action_type : 'DELETE',
        security_group_name: selectedInterest,
        security_admin_name : selectedAdmin,
      };
      onDeleteSecurityGroupAdmin(_data);
    };
    const onDeleteSecurityGroupAdmin = async (data: any) => {
      setIsSubmitting(true);
      const response = await modifySecurityGroupAdmin(data);
      if (response.message === 'success') {
          const data = {username : cookies.WatcherWebUserName, security_group_name:selectedInterest};
          loadSecurityGroupAdmin(data);   
      } else {
        setError(createMessage(response));
      }
      setIsSubmitting(false);
    };        

    return(
        <div className={styles.content} >
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
                    onClick={querySecurityGroup}
                    sx={{ mt: 3, mb: 2 , 
                        backgroundColor:"rgba(25,137,43,255)",
                        ":hover": { backgroundColor: "rgba(13,118,33,255)" }
                        }}
                >새로고침
                </Button>
              </div>
            </Toolbar>                    
        <Box sx={{ width: '100%', 
            display: 'flex', // 수평 배치 설정
            // justifyContent: 'space-between', // 두 컴포넌트 사이에 공간을 배분
            gap:10,
            ml:2,
            }}>

            {/* 보안그룹  */}    
            <div >
                <Toolbar sx={{height: 50, 
                        minHeight:50,   
                        flexGrow: 1,  
                        //justifyContent: "flex-end", 
                        display: 'flex', // Flexbox 설정
                        // justifyContent: 'center', 
                        '@media (min-width: 600px)': {
                        minHeight: 40, // This ensures the minHeight is 40px even for larger screens
                        },  
                    }} >
                    <div className={styles.checkboxSearchStack} >
                        <Typography
                            variant="body1"
                            sx={{ mt: 5, mb: 5, fontWeight: 'bold'
                                }}
                        >{t('common.security_group')}
                        </Typography>   
                    </div>
                </Toolbar>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' , mb:0.5}}>
                <Button  onClick={handleClickAddSecurityOpen}
                    sx={{
                        minWidth: 0,  // 버튼의 최소 너비를 없애 아이콘만 보이게
                        padding: 1,   // 버튼 내부 여백
                        color: 'inherit',  // 기본 텍스트 색상 상속
                        backgroundColor: '#fcdba0',
                        transition: 'background-color 0.3s', // 색상 변경 애니메이션
                        '&:hover': {
                        backgroundColor: '#90caf9',  // 마우스 오버 시 배경색
                        },
                        '&:active': {
                        backgroundColor: '#1976d2',  // 클릭 시 배경색
                        },
                    }}>
                    <AddIcon  fontSize="small"/>
                </Button>
                <Button  onClick={deleteSecurityGroup}
                    sx={{
                        minWidth: 0,  // 버튼의 최소 너비를 없애 아이콘만 보이게
                        padding: 1,   // 버튼 내부 여백
                        color: 'inherit',  // 기본 텍스트 색상 상속
                        backgroundColor: '#fcdba0',
                        transition: 'background-color 0.3s', // 색상 변경 애니메이션
                        '&:hover': {
                        backgroundColor: '#90caf9',  // 마우스 오버 시 배경색
                        },
                        '&:active': {
                        backgroundColor: '#1976d2',  // 클릭 시 배경색
                        },
                    }}>
                    <RemoveIcon  fontSize="small"/>
                </Button>
                </Box>   
                <Paper style={{ width: 200, 
                     maxHeight: 400, 
                     minHeight:300, 
                     overflow: 'auto',  
                     backgroundColor: 'transparent',
                     border: '1px solid black', // 테두리 설정
                     borderRadius: '4px', // 테두리 모서리 둥글게
                     padding: 1, // 내측 여백 추가 
                     boxShadow: 'none', }} >
 
                <List
                    sx={{
                        maxHeight: 300, 
                        minHeight:200,
                    }}  
                >
                    {securityGroupData.map((option) => (
                    <ListItem key={option.security_group_name} disablePadding>
                        <ListItemButton
                        selected={selectedInterest === option.security_group_name}
                        onClick={() => handleSelect(option)}
                        sx={{
                            bgcolor: selectedInterest === option.security_group_name ? '#1976d2' : 'transparent', // 선택된 항목만 파란색 배경
                            '&.Mui-selected': {
                            bgcolor: '#1976d2', // 선택 상태일 때 배경색
                            },
                            '&:hover': {
                            bgcolor: '#90caf9', // 마우스 오버 시 배경색
                            },
                            '&.Mui-selected:hover': {
                            bgcolor: '#1976d2', // 선택된 항목에 마우스를 올렸을 때 배경색
                            },
                        }}
                        >
                        <ListItemText primary={option.security_group_name} />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>
                </Paper>
            </div >
 

            {/* 관리자  */}
            <div>
                <Toolbar sx={{height: 50, 
                        minHeight:50,   
                        flexGrow: 1,  
                        //justifyContent: "flex-end", 
                        display: 'flex', // Flexbox 설정
                        //justifyContent: 'center', 
                        '@media (min-width: 600px)': {
                        minHeight: 40, // This ensures the minHeight is 40px even for larger screens
                        },  
                    }} >
                    <div className={styles.checkboxSearchStack} >
                        <Typography
                           variant="body1"
                           sx={{ mt: 5, mb: 5, fontWeight: 'bold'
                                }}
                        >{t('common.administrator')}
                        </Typography>   
                    </div>
                </Toolbar>   
                
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' , mb:0.5}}>
                <Button onClick={handleClickAddSecurityAdminOpen}
                    sx={{
                        minWidth: 0,  // 버튼의 최소 너비를 없애 아이콘만 보이게
                        padding: 1,   // 버튼 내부 여백
                        color: 'inherit',  // 기본 텍스트 색상 상속
                        backgroundColor: '#fcdba0',
                        transition: 'background-color 0.3s', // 색상 변경 애니메이션
                        '&:hover': {
                        backgroundColor: '#90caf9',  // 마우스 오버 시 배경색
                        },
                        '&:active': {
                        backgroundColor: '#1976d2',  // 클릭 시 배경색
                        },
                    }}>
                    <AddIcon  fontSize="small"/>
                </Button>
                <Button onClick={deleteSecurityGroupAdmin}
                    sx={{
                        minWidth: 0,  // 버튼의 최소 너비를 없애 아이콘만 보이게
                        padding: 1,   // 버튼 내부 여백
                        color: 'inherit',  // 기본 텍스트 색상 상속
                        backgroundColor: '#fcdba0',
                        transition: 'background-color 0.3s', // 색상 변경 애니메이션
                        '&:hover': {
                        backgroundColor: '#90caf9',  // 마우스 오버 시 배경색
                        },
                        '&:active': {
                        backgroundColor: '#1976d2',  // 클릭 시 배경색
                        },
                    }}>
                    <RemoveIcon  fontSize="small"/>
                </Button>
                </Box>
                <Paper style={{ width: 200, 
                    maxHeight: 400, 
                    minHeight:300, 
                    overflow: 'auto',  
                    backgroundColor: 'transparent',
                    border: '1px solid black', // 테두리 설정
                    borderRadius: '4px', // 테두리 모서리 둥글게
                    padding: 1, // 내측 여백 추가 
                    boxShadow: 'none', }} >
                <List
                    sx={{
                        maxHeight: 300, 
                        minHeight:200,
                    }}  
                >
                    {securityGroupAdminData.map((option) => (
                    <ListItem key={option.security_group_admin_name} disablePadding>
                        <ListItemButton
                        selected={selectedAdmin === option.security_group_admin_name}
                        onClick={() => handleSelectManager(option)}
                        sx={{
                            bgcolor: selectedAdmin === option.security_group_admin_name ? '#1976d2' : 'transparent', // 선택된 항목만 파란색 배경
                            '&.Mui-selected': {
                            bgcolor: '#1976d2', // 선택 상태일 때 배경색
                            },
                            '&:hover': {
                            bgcolor: '#90caf9', // 마우스 오버 시 배경색
                            },
                            '&.Mui-selected:hover': {
                            bgcolor: '#1976d2', // 선택된 항목에 마우스를 올렸을 때 배경색
                            },
                        }}
                        >
                        <ListItemText primary={option.full_name+'('+option.department+')'} />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>
                </Paper>  
            </div>
            {/* 부서 */}
            <div >
                <Toolbar sx={{height: 50, 
                        minHeight:50,   
                        flexGrow: 1,  
                        //justifyContent: "flex-end", 
                        display: 'flex', // Flexbox 설정
                       // justifyContent: 'center',  수평 중앙 정렬
                        '@media (min-width: 600px)': {
                        minHeight: 40, // This ensures the minHeight is 40px even for larger screens
                        },  
                    }} >
                    <div className={styles.checkboxSearchStack} >
                        <Typography
                            variant="body1"
                            sx={{ mt: 5, mb: 5, fontWeight: 'bold'
                                }}
                        >{t('common.dept')}
                        </Typography>   
                    </div>
                </Toolbar>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' , mb:0.5}}>
                <Button onClick={handleClickAddSecurityDeptOpen}
                    sx={{
                        minWidth: 0,  // 버튼의 최소 너비를 없애 아이콘만 보이게
                        padding: 1,   // 버튼 내부 여백
                        color: 'inherit',  // 기본 텍스트 색상 상속
                        backgroundColor: '#fcdba0',
                        transition: 'background-color 0.3s', // 색상 변경 애니메이션
                        '&:hover': {
                        backgroundColor: '#90caf9',  // 마우스 오버 시 배경색
                        },
                        '&:active': {
                        backgroundColor: '#1976d2',  // 클릭 시 배경색
                        },
                    }}>
                    <AddIcon  fontSize="small"/>
                </Button>
                <Button onClick={deleteSecurityGroupDept}
                    sx={{
                        minWidth: 0,  // 버튼의 최소 너비를 없애 아이콘만 보이게
                        padding: 1,   // 버튼 내부 여백
                        color: 'inherit',  // 기본 텍스트 색상 상속
                        backgroundColor: '#fcdba0',
                        transition: 'background-color 0.3s', // 색상 변경 애니메이션
                        '&:hover': {
                        backgroundColor: '#90caf9',  // 마우스 오버 시 배경색
                        },
                        '&:active': {
                        backgroundColor: '#1976d2',  // 클릭 시 배경색
                        },
                    }}>
                    <RemoveIcon  fontSize="small"/>
                </Button>
                </Box>
                <Paper style={{ width: 200, 
                     maxHeight: 400, 
                     minHeight:300, 
                     overflow: 'auto',  
                     backgroundColor: 'transparent',
                     border: '1px solid black', // 테두리 설정
                     borderRadius: '4px', // 테두리 모서리 둥글게
                     padding: 1, // 내측 여백 추가 
                     boxShadow: 'none', }} >
 
                <List
                    sx={{
                        maxHeight: 300, 
                        minHeight:200,
                    }}  
                >
                    {securityGroupDeptData.map((option) => (
                    <ListItem key={option.dept_id} disablePadding>
                        <ListItemButton
                        selected={selectedDept === option.dept_name}
                        onClick={() => handleSelectDept(option)}
                        sx={{
                            bgcolor: selectedDept === option.dept_name ? '#1976d2' : 'transparent', // 선택된 항목만 파란색 배경
                            '&.Mui-selected': {
                            bgcolor: '#1976d2', // 선택 상태일 때 배경색
                            },
                            '&:hover': {
                            bgcolor: '#90caf9', // 마우스 오버 시 배경색
                            },
                            '&.Mui-selected:hover': {
                            bgcolor: '#1976d2', // 선택된 항목에 마우스를 올렸을 때 배경색
                            },
                        }}
                        >
                        <ListItemText primary={option.dept_name} />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>
                </Paper>
            </div >            
        </Box>
        <div className={styles.checkboxSearchStack} >
            <Typography
                variant="body2"
                sx={{ mt: 5, mb: 5, ml:2,
                    }}
            > {t(error.content)}
            </Typography>   
        </div>
        <AddSecurityGroup open={addSecurityGroup} handleClose={handleClickAddSecurityClose} querySecurityGroup={querySecurityGroup} />
        <AddSecurityAdmin open={addSecurityAdmin} securityGroupName={selectedInterest} handleClose={handleClickAddSecurityAdminClose} loadSecurityGroupAdmin={loadSecurityGroupAdmin} />
        <AddSecurityDept open={addSecurityDept} securityGroupName={selectedInterest} handleClose={handleClickAddSecurityDeptClose} loadSecurityGroupDept={loadSecurityGroupDept} />
        </div>
    );

}
export default SecurityGroupViewContent;