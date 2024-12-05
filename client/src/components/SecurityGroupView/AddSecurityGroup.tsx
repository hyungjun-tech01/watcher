import React, {useState, useCallback} from 'react';
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
  } from "@mui/material";
import { useTranslation } from "react-i18next";
import { apiPasswordChange } from "../../api/user";

const createMessage = (error: IError) => {
    if (!error) {
      return error;
    }
    switch (error.message) {
      case "Duplicate Security Group":
        return {
          ...error,
          type: "error",
          content: "common.duplicateSecurityGroup",
        };
      case "Not Admin":
        return {
          ...error,
          type: "warning",
          content: "common.onlySecurityGroupAdmin",
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
    handleClose: () => void;
  }

function AddSecurityGroup({ open, handleClose }: AddSecurityProps){

    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<IError>(initErrorContent);    

    const addSecurityGroup = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const _data = {
            security_group_name: data.get("security_group_name"),
            security_group_memo: data.get("security_group_memo")
          };
          console.log(_data);
          onValid(_data);
        },
        []
      );
      const onValid = async (data: any) => {
        setIsSubmitting(true);
       
        const response = await apiPasswordChange(data);
    
        if (response.message) {
          setError(createMessage(response));
        } else {
          handleClose();
        }
        setIsSubmitting(false);
      };    
    return(
        <Dialog 
            open={open}
            onClose={handleClose}
        >
            <DialogTitle> {t('common.addSecurityGroup')}</DialogTitle>
            <Box  component="form" onSubmit={addSecurityGroup} >
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
            >
                <DialogContentText>
                {t('common.securityGroupName')}
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
export default AddSecurityGroup;

/**
 import React, {useState, useCallback } from "react";
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
  } from "@mui/material";
import { useTranslation } from "react-i18next";
import { apiPasswordChange } from "../api/user";


const createMessage = (error: IError) => {
    if (!error) {
      return error;
    }
    switch (error.message) {
      case "Invalid userName or email":
        return {
          ...error,
          type: "error",
          content: "common.invalidEmail",
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
  

interface ForgotPasswordProps {
    open: boolean;
    handleClose: () => void;
  }

  const  ForgotPassword = ({ open, handleClose }: ForgotPasswordProps) => {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<IError>(initErrorContent);

    const handlePasswordChange = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const user_data = {
            username: data.get("username"),
            email: data.get("email"),
            password: data.get("password"),
          };
          console.log(user_data);
          onValid(user_data);
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
            <DialogTitle> {t('common.resetPassword')}</DialogTitle>
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
                    id="email"
                    name="email"
                    label="Email address"
                    placeholder="Email address"
                    type="email"
                    fullWidth
                />
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="password"
                    name="password"
                    label="비밀번호"
                    placeholder="비밀번호"
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
  };
  export default ForgotPassword;
 * 
 */