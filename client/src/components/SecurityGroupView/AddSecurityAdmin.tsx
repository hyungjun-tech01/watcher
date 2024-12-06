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
    InputLabel
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

  function AddSecurityAdmin({ open, securityGroupName, handleClose, loadSecurityGroupAdmin }: AddSecurityProps){
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<IError>(initErrorContent);    
    const { modifySecurityGroupAdmin, loadAllUser4Security} = useRecoilValue(SecurityGroupRepository);
    const securityUserData = useRecoilValue(atomsUserData);

    const [cookies, setCookie, removeCookie] = useCookies(['WatcherWebUserId','WatcherWebUserName', 'WatcherWebAuthToken']);
    const [selectedValue, setSelectedValue] = useState<string>('');


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
      setSelectedValue(event?.target.value as string);
    }  
                  
    useEffect(() => {
      setSelectedValue('');
      loadAllUser4Security();
    }, [open]);

    const addSecurityAdmin = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const _data = {
            action_type : 'ADD',
            security_group_name : data.get("dept_security_group_name"),
            security_admin_name: data.get("security_admin_name"),
            modify_user : cookies.WatcherWebUserId,
          };
          onValid(_data);
        },
        []
      );
      const onValid = async (data: any) => {
        setIsSubmitting(true);
        console.log(data);
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
                 <TextField  
                    label={t("common.security_admin_name")}
                    id="security_admin_name"
                    name="security_admin_name"
                    select
                    value={selectedValue}
                    placeholder=  {t('common.security_admin_name')}
                    onChange={handleChange}
                    fullWidth
                    helperText={t(error.content)}
                 >
                    {securityUserData.map((user) => (
                    <MenuItem key={user.user_name} value={user.user_name}>
                        {user.full_name + '('+ user.department +')'}
                    </MenuItem>
                    ))}
                </TextField>                                     
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
