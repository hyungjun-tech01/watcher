import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Paper, Box , Typography, Toolbar, Button} from '@mui/material';
import { useTranslation } from "react-i18next";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import styles from "./SecurityGroupViewContent.module.scss";


function SecurityGroupViewContent(){
    const [t] = useTranslation();
    const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

    const options = ["일반","내부감사"];

    const manager = ["정낙준","홍길동","정낙준","홍길동","정낙준","홍길동","정낙준","홍길동"];

    const dept = ["인사부","감사실"];
  
    const handleSelect = (interest: string) => {
      setSelectedInterest(interest);
    };    
    return(
        <div className={styles.content} >
                    
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
                <Button
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
                <Button
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
                    {options.map((option) => (
                    <ListItem key={option} disablePadding>
                        <ListItemButton
                        selected={selectedInterest === option}
                        onClick={() => handleSelect(option)}
                        sx={{
                            bgcolor: selectedInterest === option ? '#1976d2' : 'transparent', // 선택된 항목만 파란색 배경
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
                        <ListItemText primary={option} />
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
                <Button
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
                <Button
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
                    {manager.map((option) => (
                    <ListItem key={option} disablePadding>
                        <ListItemButton
                        selected={selectedInterest === option}
                        onClick={() => handleSelect(option)}
                        sx={{
                            bgcolor: selectedInterest === option ? '#1976d2' : 'transparent', // 선택된 항목만 파란색 배경
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
                        <ListItemText primary={option} />
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
                <Button
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
                <Button
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
                    {dept.map((option) => (
                    <ListItem key={option} disablePadding>
                        <ListItemButton
                        selected={selectedInterest === option}
                        onClick={() => handleSelect(option)}
                        sx={{
                            bgcolor: selectedInterest === option ? '#1976d2' : 'transparent', // 선택된 항목만 파란색 배경
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
                        <ListItemText primary={option} />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>
                </Paper>
            </div >            
        </Box>
        </div>
    );

}
export default SecurityGroupViewContent;