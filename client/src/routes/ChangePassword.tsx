import React, {useState, useCallback } from "react";
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
  } from "@mui/material";
import { useTranslation } from "react-i18next";
import { apiPasswordChange } from "../api/user";


const createMessage = (error: IError) => {
    if (!error) {
      return error;
    }
    switch (error.message) {
      case "Invalid userName or password":
        return {
          ...error,
          type: "error",
          content: "common.invalidEmailOrUsername",
        };
      case "Failed to fetch":
        return {
          ...error,
          type: "warning",
          content: "common.serverConnectionFailed",
        };
      case "Network request failed":
        return {
          ...error,
          type: "warning",
          content: "common.noInternetConnection",
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
  

interface ChangePasswordProps {
    open: boolean;
    handleClose: () => void;
  }

const  ChangePassword = ({ open, handleClose }: ChangePasswordProps) => {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<IError>(initErrorContent);

    const handlePasswordChange = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);

          if(  data.get("new_password1") ===  data.get("new_password2")){
            const user_data = {
              username: data.get("username"),
              old_password: data.get("old_password"),
              new_password: data.get("new_password1"),
            };
            onValid(user_data);
          }else{
            const checkSecurityGroup: IError = { message: "", type: "warning", content: "common.newpassword_missmatch" };
            setLoginError(checkSecurityGroup)
            return;
          }
        },
        []
      );

    const onValid = async (data: any) => {
        setIsSubmitting(true);
        const response = await apiPasswordChange(data);
    
        if (response.message) {
          setLoginError(createMessage(response));
        } else {
          handleClose();
        }
        setIsSubmitting(false);
      };  
    return (
        <Dialog 
            open={open}
            onClose={handleClose}
        >
            <DialogTitle> {t('common.changePassword')}</DialogTitle>
            <Box  component="form" onSubmit={handlePasswordChange} >
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
            >
                <DialogContentText>
                {t('common.resetPasswordText')}
                </DialogContentText>       
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="username"
                    name="username"
                    label= {t('common.userId')}
                    placeholder=  {t('common.userId')}
                    type="username"
                    fullWidth
                />      
                 <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="old_password"
                    name="old_password"
                    label="예전 비밀번호"
                    placeholder="예전 비밀번호"
                    type="password"
                    fullWidth
                />  
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="new_password1"
                    name="new_password1"
                    label="새 비밀번호"
                    placeholder="새 비밀번호"
                    type="password"
                    fullWidth
                />
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="new_password2"
                    name="new_password2"
                    label="새 비밀번호 다시 입력"
                    placeholder="새 비밀번호 다시 입력"
                    type="password"
                    fullWidth
                    helperText= {t(loginError.content)}
                />
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
 
  export default ChangePassword;