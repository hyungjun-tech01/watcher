import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { styled, alpha } from "@mui/material/styles";
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
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
        width: "20ch",
      },
    },
  },
}));

function AuditLogViewContent() {
  const [t] = useTranslation();
  return (
    <div className={styles.content}>
        <Toolbar sx={{ flexGrow: 1, justifyContent: "space-between"}}>
            <div className={styles.searchStack}>
                <Checkbox {...label}>t('common.detectIDInfo')</Checkbox>
                <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                {t("common.detectIDInfo")}
                </Typography>
            </div>
            <div  className={styles.searchStack}>
                <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                {t("common.users")}
                </Typography>
                <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder={t('common.search')}
                    inputProps={{ "aria-label": "search" }}
                />
                </Search>
            </div>
        </Toolbar>
        <AuditLogTable/>
    </div>
  );
}
export default AuditLogViewContent;
