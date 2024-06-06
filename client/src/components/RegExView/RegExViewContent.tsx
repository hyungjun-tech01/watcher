import Checkbox from "@mui/material/Checkbox";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Button from '@mui/material/Button';

import Paper from "@mui/material/Paper";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDateNumberForTable } from "../../constants/DateFns";
import styles from "./RegExViewContent.module.scss";
import RegExTable from "./RegExTable";


function RegExViewContent() {
    const [executeQuery, setExecuteQuery] = useState<boolean>(false);
    useEffect(() => {
        setExecuteQuery(!executeQuery);
      }, []);

    const handleAddClick = ()=>{

    };
    return (
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
                />
            </Paper>
        </div>
    );
}
export default RegExViewContent;