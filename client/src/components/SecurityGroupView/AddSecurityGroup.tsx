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
import { useRecoilValue } from 'recoil';
import { SecurityGroupRepository } from "../../repository/securityGroupRepository";
import {useCookies} from "react-cookie";

const createMessage = (error: IError) => {
    if (!error) {
      return error;
    }
    switch (error.message) {
      case "Duplicate Security Group":
        return {
          ...error,
          type: "error",
          content: "common.duplicate_security_group",
        };
      case "Not Admin":
        return {
          ...error,
          type: "warning",
          content: "common.only_security_group_admin",
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

  interface AddSecurityProps {
    open: boolean;
    handleClose: () => void;
    querySecurityGroup : ()=>void;
  }

function AddSecurityGroup({ open, handleClose, querySecurityGroup }: AddSecurityProps){

    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<IError>(initErrorContent);    
    const { modifySecurityGroup} = useRecoilValue(SecurityGroupRepository);
    const [cookies, setCookie, removeCookie] = useCookies(['WatcherWebUserId','WatcherWebUserName', 'WatcherWebAuthToken']);

    const addSecurityGroup = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const _data = {
            action_type : 'ADD',
            security_group_name: data.get("security_group_name"),
            security_group_memo: data.get("security_group_memo"),
            modify_user : cookies.WatcherWebUserId,
          };
          onValid(_data);
        },
        []
      );
      const onValid = async (data: any) => {
        setIsSubmitting(true);
        const response = await modifySecurityGroup(data);
        if (response.message === 'success') {
          querySecurityGroup();
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
            <DialogTitle> {t('common.add_security_group')}</DialogTitle>
            <Box  component="form" onSubmit={addSecurityGroup} >
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, 
                      maxWidth: '100%', // 부모 폭 초과 방지
                      overflowX: 'hidden', // 가로 스크롤 제거
                    }}
            >
                <DialogContentText>
                {t('common.add_security_group_name')}
                </DialogContentText>       
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="security_group_name"
                    name="security_group_name"
                    label= {t('common.security_group_name')}
                    placeholder=  {t('common.security_group_name')}
                    type="text"
                    fullWidth
                />      
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="security_group_memo"
                    name="security_group_memo"
                    label= {t('common.security_group_memo')}
                    placeholder=  {t('common.security_group_memo')}
                    type="text"
                    helperText= {t(error.content)}
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