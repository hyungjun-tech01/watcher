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
    MenuItem,
    Select,
    FormHelperText,
    InputLabel,
    Autocomplete
  } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from 'recoil';
import { SecurityGroupRepository } from "../../repository/securityGroupRepository";
import { atomsUserData } from '../../atoms/atomsSecurityGroup';
import {useCookies} from "react-cookie";

const createMessage = (error: IError) => {
    if (!error) {
      return error;
    }
    switch (error.message) {
      case "Duplicate Security Group Admin":
        return {
          ...error,
          type: "error",
          content: "common.duplicate_security_group_admin",
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
    loadSecurityGroupAdmin : (data:any)=>void;
  }
  interface userDataLovType {
    id: string;
    label :string;
}

  function AddSecurityAdmin({ open, securityGroupName, handleClose, loadSecurityGroupAdmin }: AddSecurityProps){
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<IError>(initErrorContent);    
    const { modifySecurityGroupAdmin, loadAllUser4Security, } = useRecoilValue(SecurityGroupRepository);
    const securityUserData = useRecoilValue(atomsUserData);


    const [cookies, setCookie, removeCookie] = useCookies(['WatcherWebUserId','WatcherWebUserName', 'WatcherWebAuthToken']);
    const [selectedValue, setSelectedValue] = useState<userDataLovType|null>(null);

    // const skills = ['HTML', 'Typescript', 'React'];
  
    const userDataLov = securityUserData.map( (user)=>({
        id: user.user_name, 
        label: user.full_name + '(' + user.department +')'
    }));


    const handleChange = (newValue:userDataLovType|null)=>{
      setSelectedValue(newValue);
    }  

                  
    useEffect(() => {
      if (open) {
        setError(initErrorContent);
        setSelectedValue(null); // `Dialog`가 열릴 때만 초기화
        loadAllUser4Security();
      }
    }, [open]);


    const addSecurityAdmin = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const _data = {
            action_type : 'ADD',
            security_group_name : data.get("dept_security_group_name"),
            security_admin_name:  selectedValue?.id,  // data.get("security_admin_name"),
            modify_user : cookies.WatcherWebUserId,
          };
          onValid(_data);
        },
       [selectedValue]
      );
      const onValid = async (data: any) => {
        setIsSubmitting(true);
        const response = await modifySecurityGroupAdmin(data);
        if (response.message === 'success') {

          const query = {username : cookies.WatcherWebUserName, security_group_name:data.security_group_name};
          loadSecurityGroupAdmin(query);    
          handleClose();
        } else {
          setError(createMessage(response));
        }
        setIsSubmitting(false);
      };    
    return(
        <Dialog 
            open={open}
            onClose={handleClose}
            maxWidth="md" // 원하는 크기 설정
        >
            <DialogTitle> {t('common.add_security_admin')}</DialogTitle>
            <Box  component="form" onSubmit={addSecurityAdmin} >
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, 
                      maxWidth: '100%', // 부모 폭 초과 방지
                      overflowX: 'hidden', // 가로 스크롤 제거
                    }}
            >
                <DialogContentText>
                {t('common.add_security_admin_text')}
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
                  id="security_admin_name"
                  fullWidth
                  options={userDataLov} 
                  renderInput={(params:any)=> <TextField {...params} label= {t('common.security_admin_name')}/>}
                  value={selectedValue||null}
                  onChange={(event:any, newValue:userDataLovType|null)=>handleChange(newValue)}
                  isOptionEqualToValue={(option, value) => value ? option.id === value.id : false}
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
export default AddSecurityAdmin;
