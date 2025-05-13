import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Import Route and Routes
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import withAuth from './HOC/withAuth';
import JobDetails from './components/JobDetails/JobDetails';


const ProtectedDashboard = withAuth(Dashboard);

const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedDashboard />} />
      <Route path="/job/:id" element={<JobDetails />} />
    </Routes>
  );
};

export default App;
