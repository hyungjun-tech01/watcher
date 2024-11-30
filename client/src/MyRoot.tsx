import React from 'react';
import { BrowserRouter as Router, Routes, Route }  from "react-router-dom";

import Core from './routes/Core';
import AuditLogView from './routes/AuditLogView';
import RegExView from './routes/RegExView';
import Settings from './routes/Settings';
import Login from './routes/Login';
import SampleTest from './routes/SampleTest';
import Path from './constants/Paths';
import './styles.module.scss';

// <Route path = {Path.ROOT} element={<Core/>} />  => AuditLogView 이쪽으로 변경 페이지가 하나 뿐이라.
const MyRoot = () => {
  return (
    <Router>
      <Routes>
        <Route path = {Path.LOGIN} element={<Login/>} />
        <Route path = {Path.AUDITLOGVIEW} element={<AuditLogView/>} />
        <Route path = {`/regexview`} element={<RegExView/>} />
        <Route path = {`/Settings`} element={<Settings/>} />
        <Route path = {Path.SAMPLE} element={<SampleTest/>} />
        <Route path = {Path.ROOT} element={<AuditLogView/>} />
      </Routes>
    </Router>
  );
}

export default MyRoot;
