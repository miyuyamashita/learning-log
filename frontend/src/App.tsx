import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import LogList from "./components/LogList";
import Search from "./components/Search";
import LogForm from "./components/LogForm";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogDetail from "./components/LogDetail";
import ChangePassword from "./components/changePassword";
import GetReset from "./components/GetReset";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signin" element={<SignupForm />} />
        <Route
          path="/home"
          element={
            <>
              <Header />
              <Search />
              <LogForm />
              <LogList />
            </>
          }
        />

        <Route path="/logDetail/:logId" element={<LogDetail />} />
        <Route path="/editLog/:logId" element={<LogForm />} />
        <Route path="/getChangePassword" element={<GetReset />} />
        <Route path="/reset-password" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
