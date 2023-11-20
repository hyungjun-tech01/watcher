import React, { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState} from "recoil";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";

import {useCookies} from "react-cookie";

import Fix from "../components/Fix";
import Static from "../components/Static";

interface ICoreParams {
    id : string;
}
function Core(){
  const [cookies] = useCookies(['UserId', 'UserName','AuthToken']);
  const {pathname} = useLocation();
  
  const [current, setCurrent] = useState(false);
  
  //const [currentBoardId, setCurrentBoardId] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState("");
    return (
      <>
          <Fix />
          <Static  />
      </>
    );
}

export default Core;