import React, {useState, useCallback, useEffect} from 'react';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    CssBaseline,
    FormControlLabel,
    Grid,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    OutlinedInput,
    DialogActions,
    Autocomplete,
  } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from 'recoil';
import { SecurityGroupRepository } from "../../repository/securityGroupRepository";
import {useCookies} from "react-cookie";
import { atomsDeptData } from '../../atoms/atomsSecurityGroup';

const createMessage = (error: IError) => {
    if (!error) {
      return error;
    }
    switch (error.message) {
      case "Duplicate Security Group Dept":
        return {
          ...error,
          type: "error",
          content: "common.duplicate_security_group_dept",
        };
      case "Not Admin":
        return {
          ...error,
          type: "warning",
          content: "common.only_security_group_admin",
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

  interface AddSecurityProps {
    open: boolean;
    securityGroupName: string|null;
    handleClose: () => void;
    loadSecurityGroupDept : (data:any)=>void;
  }
  interface deptDataLovType {
    id: string;
    label :string;
  }

function AddSecurityDept({ open, securityGroupName, handleClose, loadSecurityGroupDept }: AddSecurityProps){
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<IError>(initErrorContent);    
    const { modifySecurityGroupDept, loadAllDept4Security} = useRecoilValue(SecurityGroupRepository);
    const [cookies, setCookie, removeCookie] = useCookies(['WatcherWebUserId','WatcherWebUserName', 'WatcherWebAuthToken']);
    const securityDeptData = useRecoilValue(atomsDeptData);
    const [selectedValue, setSelectedValue] = useState<deptDataLovType|null>(null);

    const deptDataLov = securityDeptData.map( (dept)=>({
      id: dept.dept_id, 
      label: dept.dept_name,
    }));

    const handleChange = (newValue:deptDataLovType|null)=>{
      setSelectedValue(newValue);
    }  

    const addSecurityDept = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const _data = {
            action_type : 'ADD',
            security_group_name : data.get("dept_security_group_name"),
            security_dept_name:  selectedValue?.label, // data.get("security_dept_name"),
            modify_user : cookies.WatcherWebUserId,
          };
          onValid(_data);
        },
        [selectedValue]
      );
      const onValid = async (data: any) => {
        setIsSubmitting(true);
        const response = await modifySecurityGroupDept(data);
        if (response.message === 'success') {

          const query = {username : cookies.WatcherWebUserName, security_group_name:data.security_group_name};
          loadSecurityGroupDept(query);    
          handleClose();
        } else {
          setError(createMessage(response));
        }
        setIsSubmitting(false);
      };    

      useEffect(() => {
        if (open) {
          setError(initErrorContent);
          setSelectedValue(null); // `Dialog`가 열릴 때만 초기화
          loadAllDept4Security();
        }
      }, [open]);

    return(
        <Dialog 
            open={open}
            onClose={handleClose}
            maxWidth="md" // 원하는 크기 설정
        >
            <DialogTitle> {t('common.add_security_dept')}</DialogTitle>
            <Box  component="form" onSubmit={addSecurityDept} >
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, 
                      maxWidth: '100%', // 부모 폭 초과 방지
                      overflowX: 'hidden', // 가로 스크롤 제거
                    }}
            >
                <DialogContentText>
                {t('common.add_security_dept_text')}
                </DialogContentText>        
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="dept_security_group_name"
                    name="dept_security_group_name"
                    label= {t('common.security_group_name')}
                    placeholder=  {t('common.security_group_name')}
                    value = {securityGroupName}
                    type="text"
                    fullWidth
                    InputProps={{
                        readOnly: true, // 읽기 전용으로 설정
                    }}
                />
                <Autocomplete 
                  id="security_dept_name"
                  fullWidth
                  options={deptDataLov} 
                  value={selectedValue || null} // selectedValue가 null일 때 안전하게 처리
                  onChange={(event: any, newValue: deptDataLovType | null) => handleChange(newValue)}
                  isOptionEqualToValue={(option, value) => value ? option.id === value.id : false}
                  renderInput={(params: any) => <TextField {...params} label={t('common.dept')} />}
                  getOptionLabel={(option) => option.label || ''} // 안전한 렌더링
                />   
                <Typography
                    variant="body2"
                    sx={{ mt: 5, mb: 5, ml:2,
                        }}
                > {t(error.content)}
                </Typography>

            </DialogContent>
            <DialogActions sx={{ pb: 3, px: 3 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" type="submit"   
                    sx={{ backgroundColor:"#19892BFF",
                    ":hover": { backgroundColor: "#0D7621FF" }
                    }}
                  >
                Continue
                </Button>
            </DialogActions>
            </Box>
        </Dialog>     
        );

}
export default AddSecurityDept;