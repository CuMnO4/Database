import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../AxiosInstance";
import { Alert, Button, Container, Snackbar } from "@mui/material";
import { GlobalConfigs } from "../Config";
import LoginPage, {
  Username,
  Password,
  Submit,
  Title,
  Logo,
  Reset,
} from "@react-login-page/base";
import { AuthContext } from "../Components/AuthContext";
import LoginLogo from "react-login-page/logo-rect";
import { useNavigate } from "react-router-dom";

export function LoginSignupPage() {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openFeedbackSnackBar, setOpenFeedBackSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    // console.log(formData.entries());
    for (var [key, val] of formData.entries()) {
      // console.log(key, val);
      if (val === "") {
        setOpenSnackBar(true);
        return;
      }
    }
    axiosInstance
      .post(GlobalConfigs.serverHostName + "/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        // save jwt token to localStorage
        localStorage.setItem("jwt_token", response.data["token"]);
        login(formData.get("username"));
        navigate("/manage");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data["status"]);
        setOpenFeedBackSnackBar(true);
      });
  };

  const testProtected = () => {
    axiosInstance
      .get(GlobalConfigs.serverHostName + "/test_protected")
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const testSQL = () => {
    axiosInstance
      .post(GlobalConfigs.serverHostName + "/performSQLQuery", {
        sql: "select * from sqlschool.student_info;",
      })
      .then((response) => {
        console.log(response.data["result"]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
      }}
      onSubmit={handleSubmit}
    >
      <LoginPage>
        <Username placeholder="请输入用户名" name="username" />
        <Password placeholder="请输入密码" name="password" />
        <Submit>提交</Submit>
        <Reset visible={false}>重置</Reset>
        <Title>数据库系统</Title>
        <Logo>
          <LoginLogo />
        </Logo>
        <Snackbar
          open={openSnackBar}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={() => {
            setOpenSnackBar(false);
          }}
        >
          <Alert severity="error">账号和密码不应为空</Alert>
        </Snackbar>
        <Snackbar
          open={openFeedbackSnackBar}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={() => {
            setOpenFeedBackSnackBar(false);
          }}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      </LoginPage>
    </form>
  );
}
