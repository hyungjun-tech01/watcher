import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Path from "../../constants/Paths";

function SideBar(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const handleAuditLog = ()=>{
        navigate(Path.AUDITLOGVIEW);
      }
//      const handleHome = ()=>{
//        navigate(Path.ROOT);
//      }
    return(
        <div className="sidebarWrapper">
            <div className="sidebarMenu">
                <h3 className="sidebarTitle">  {t('common.productName')}</h3>
                <ul className="sidevarList">
                    <li className="sidebarListItem" onClick={handleAuditLog}>
                    {t('menu.auditlogview')}
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default SideBar;