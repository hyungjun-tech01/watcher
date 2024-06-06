import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import CodeIcon from '@mui/icons-material/Code';
import Path from "../../constants/Paths";
import styles from "./SideBar.module.scss";

function SideBar(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const handleAuditLog = ()=>{
        navigate(Path.AUDITLOGVIEW);
      }

      const handleRegEx = ()=>{
        navigate(`/regexview`);
      }      
//      const handleHome = ()=>{
//        navigate(Path.ROOT);
//      }
    return(
        <div className={styles.sidebarWrapper}>
            <div className= {styles.sidebarMenu}>
                <h3 className= {styles.sidebarTitle}>  {t('common.productName')}</h3>
                <ul className={styles.sidebarList}>
                    <li className={styles.sidebarListItem}  onClick={handleAuditLog}>
                        <ContentPasteSearchIcon />
                        {t('menu.auditlogview')}
                    </li>
                    <li className={styles.sidebarListItem}  onClick={handleRegEx}>
                        <CodeIcon />
                        {t('menu.regex')}
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default SideBar;