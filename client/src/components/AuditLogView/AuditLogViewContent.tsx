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
import styles from "./AuditLogViewContent.module.scss";
import AuditLogTable from "./AuditLogTable";

const label = { inputProps: { "aria-label": "show private info, or not." } };

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "12ch",
      },
    },
  },
}));

function AuditLogViewContent() {
  const [t] = useTranslation();
  const [user, setUser] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [detect, setDetect] = useState<boolean>(true);
  const [privacyText, setPrivacyText] = useState<string>('');
  const [executeQuery, setExecuteQuery] = useState<boolean>(false);

  const handleChangeDetect = useCallback((event: React.ChangeEvent) => {
    setDetect((prev) => !prev);
  }, []);

  const handleChangeStartDate = useCallback(
    (newDate: Date | null) => {
      if (newDate) {
        if (newDate.getTime() < endDate.getTime()) {
          setStartDate(newDate);
        }
      }
    },
    [endDate]
  );

  const handleChangeEndDate = useCallback(
    (newDate: Date | null) => {
      if (newDate) {
        if (newDate.getTime() > startDate.getTime()) {
          setEndDate(newDate);
        }
      }
    },
    [startDate]
  );

  const handleChangeUser = useCallback(
    (event: any) => {
      setUser(event.target.value);
    },
    [setUser]
  );

  const handlePrivacyText = useCallback(
    (event: any) => {
      setPrivacyText(event.target.value);
    },
    [setPrivacyText]
  );
  const handleOnClick = (event:any)=>{
    event.preventDefault();
    setExecuteQuery(!executeQuery);
  };

  useEffect(() => {
    const currentDate = new Date();
    setEndDate(currentDate);
    const weekAgo = new Date(currentDate);
    weekAgo.setDate(currentDate.getDate() - 7);
    setStartDate(weekAgo);
    setExecuteQuery(!executeQuery);
  }, []);
  return (
    <div className={styles.content}>
      <Toolbar sx={{height: 40, minHeight:40,   flexGrow: 1,  justifyContent: "space-around", 
        '@media (min-width: 600px)': {
          minHeight: 40, // This ensures the minHeight is 40px even for larger screens
        },
       }}>

        <div className={styles.searchStack}>
             <DatePicker
              value={startDate}
              label={'From'}
              onChange={(newValue) => handleChangeStartDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
              sx={{ width: 180}}
            /> 
        </div>
        <div className={styles.searchStack}>
               <DatePicker
              value={endDate}
              label={'To'}
              onChange={(newValue) => handleChangeEndDate(newValue)}
              slotProps={{ textField: { size: 'small' } }}
              sx={{ width: 180 }}
            />
        </div>
        <div className={styles.checkboxSearchStack}>
          <Checkbox {...label} checked={detect} onChange={handleChangeDetect} />
          <Typography variant="body2" component="div" sx={{ flexGrow: 1 }}>
            {t("common.detectIDInfo")}
          </Typography>
        </div>
        <div className={styles.searchStack}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder= {t("common.users")}
              inputProps={{ "aria-label": "search" }}
              value={user}
              onChange={handleChangeUser}
            />
          </Search>
        </div>
        <div className={styles.searchStack}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder={t("common.detect_result")}
              inputProps={{ "aria-label": "search" }}
              value={privacyText}
              onChange={handlePrivacyText}
            />
          </Search>
        </div>
        <div className={styles.checkboxSearchStack}>
          <Button
            type="submit"
            variant="contained"
            onClick={handleOnClick}
            sx={{ mt: 3, mb: 2 , 
                 backgroundColor:"rgba(25,137,43,255)",
                ":hover": { backgroundColor: "rgba(13,118,33,255)" }
                }}
          >조회
          </Button>
        </div>
      </Toolbar>

      <Paper elevation={3} sx={{ m: 2  }}>
        <AuditLogTable
          userName={user}
          detectValue={detect}
          fromTime={getDateNumberForTable(startDate)}
          toTime={getDateNumberForTable(endDate)}
          privacyText={privacyText}
          executeQuery={executeQuery}
        />
      </Paper>
    </div>
  );
}
export default AuditLogViewContent;
