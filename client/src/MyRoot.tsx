import React from 'react';
import { BrowserRouter as Router, Routes, Route }  from "react-router-dom";

import Core from './routes/Core';
import AuditLogView from './routes/AuditLogView';
import Login from './routes/Login';
import SampleTest from './routes/SampleTest';
import Path from './constants/Paths';
import './styles.module.scss';

const MyRoot = () => {
  return (
    <Router>
      <Routes>
        <Route path = {Path.LOGIN} element={<Login/>} />
        <Route path = {Path.AUDITLOGVIEW} element={<AuditLogView/>} />
        <Route path = {Path.BOARDS} element={<Core/>} />
        <Route path = {Path.SAMPLE} element={<SampleTest/>} />
        <Route path = {Path.ROOT} element={<Core/>} />
      </Routes>
    </Router>
  );
}

export default MyRoot;
