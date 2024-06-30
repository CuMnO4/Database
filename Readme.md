# 数据库实验网站项目文档

## 项目部署

本项目的后端部署在 Autodl 平台的 6006 端口上，并向外部开放，前端通过指定的 URL 向后端发送请求；前端代码在 Codesandbox 平台上编译并部署，用户可以通过 Codesandbox 提供的 URL 直接访问前端应用，从而实现前后端的有效分离和交互。

**成员分工**

刘威：前后端代码编写，测试
杨晔嘉：文档整理，优化前端展示
高梦彤：提供平台，实验报告撰写

## 一、前端

本项目的前端采用 `react` 框架，组件库采用了 `material ui` ，在视觉上尽可能保持统一。

前端操作的流程是：首先访问前端项目启动的 `url` ，在未登录状态下会经过前端路由自动跳转到 `/login` 界面，在该界面输入用户名和密码后点击登录，经过前端路由跳转到 `/manage` 界面。以下我们详细介绍各个组件：

### App

`App` 组件是 React 应用的主入口，使用 React Router 实现路由功能，并通过 `AuthProvider` 提供认证状态管理。应用包含两个主要的路由：

- `/login` 路由渲染 `LoginSignupPage` 组件，用户在此页面进行登录操作。
- `/manage` 路由渲染 `ManagePage` 组件，用户在登录后访问管理页面。

未匹配到的路径会重定向到 `/login` 页面，确保用户总是从登录页面开始操作。通过 `AuthProvider` 包裹整个应用，所有子组件都可以访问和修改认证状态，实现用户登录和登出的功能。

##### 1. 导入必要的库和组件

- **React**：用于构建组件和管理状态。
- **LoginSignupPage** 和 **ManagePage**：导入登录页面和管理页面组件。
- **React Router**：用于管理客户端路由。
  - **Routes**：路由容器，包含所有路由定义。
  - **Route**：单个路由定义，指定路径和对应的组件。
  - **Navigate**：用于重定向。
  - **BrowserRouter**：用于包裹整个应用，提供路由功能。
- **AuthContext** 和 **AuthProvider**：导入认证上下文和提供认证状态管理的组件。

```jsx
import * as React from "react";
import { LoginSignupPage } from "./Pages/LoginPage";
import { ManagePage } from "./Pages/ManagePage";
import { Routes, Navigate, Route, BrowserRouter } from "react-router-dom";
import { AuthContext, AuthProvider } from "./Components/AuthContext";
```

##### 2. 主组件 `App`

- **AuthProvider**：使用认证提供器包裹整个应用，确保所有子组件都可以访问认证状态。
- **BrowserRouter**：包裹所有路由配置，为应用提供路由功能。
- **Routes**：包含所有路由定义的容器。
  - **Route path="/login" element={}**：定义登录页面的路由，当访问 `/login` 路径时渲染 `LoginSignupPage` 组件。
  - **Route path="/manage" element={}**：定义管理页面的路由，当访问 `/manage` 路径时渲染 `ManagePage` 组件。
  - **Route path="*" element={}**：定义通配符路由，当访问未定义路径时重定向到 `/login` 页面。

```jsx
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginSignupPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

##### 3. 认证上下文和提供器

在组件树的顶层使用 `AuthProvider` 包裹整个应用，使得所有子组件都可以访问认证状态。

### AuthContext

`AuthContext` 组件使用 `createContext` 和 `useState` 实现了一个简单的认证状态管理系统。`AuthProvider` 组件通过 `AuthContext.Provider` 将认证状态和登录函数提供给所有子组件。应用通过 `AuthProvider` 包裹整个应用，使得所有子组件都可以访问和使用认证状态，实现用户登录功能。

以下是 `AuthContext` 的完整代码：

```jsx
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  const login = (name) => {
    setUsername(name);
  };

  return (
    <AuthContext.Provider value={{ username, login }}>
      {children}
    </AuthContext.Provider>
  );
};
```

以下是该组件的详细描述：

##### 1.**创建上下文**：

```jsx
export const AuthContext = createContext();
```

- `AuthContext`：用于在组件间共享认证状态的上下文。

##### 2.**认证提供器组件**：

```jsx
export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  const login = (name) => {
    setUsername(name);
  };

  return (
    <AuthContext.Provider value={{ username, login }}>
      {children}
    </AuthContext.Provider>
  );
};
```

- **username**：用于管理当前登录用户名的状态变量。
  
- **login 函数**：用于更新用户名状态。
  
  ```jsx
  const login = (name) => {
    setUsername(name);
  };
  ```
  
- **AuthProvider 组件**：使用 `AuthContext.Provider` 将认证状态和登录函数提供给所有子组件。
  
  ```jsx
  return (
    <AuthContext.Provider value={{ username, login }}>
      {children}
    </AuthContext.Provider>
  );
  ```
  

##### 在 `app.js` 中的使用

在 `app.js` 中，通过 `AuthProvider` 包裹整个应用，使得所有子组件都可以访问和使用认证状态。

```jsx
import * as React from "react";
import { LoginSignupPage } from "./Pages/LoginPage";
import { ManagePage } from "./Pages/ManagePage";
import { Routes, Navigate, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Components/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginSignupPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
} 
```

### AxiosInstance

`axiosInstance` 提供了一个统一的、带有认证信息的 HTTP 请求工具，简化了应用中与后端服务器的通信。

##### 1. 导入必要的库和配置

- **axios**：用于发送 HTTP 请求的流行库。
- **GlobalConfigs**：包含全局配置的模块，可能定义了服务器的主机名等信息。

```javascript
import axios from "axios";
import { GlobalConfigs } from "./Config";
```

##### 2. 创建 `axios` 实例

- **axios.create**：创建一个 axios 实例，允许自定义配置。
  
- **baseURL**：设置基础 URL，所有请求都将相对于这个 URL 进行。这里的值来自 `GlobalConfigs.serverHostName`。
  
- **timeout**：设置请求超时时间，单位为毫秒。在这里设置为 5000 毫秒（5 秒）。
  

```javascript
const axiosInstance = axios.create({
  baseURL: GlobalConfigs.serverHostName,
  timeout: 5000, // Adjust as needed
});
```

##### 3. 添加请求拦截器

**请求拦截器**：在请求发送之前执行一些操作，通常用于修改请求配置。

- **获取 token**：从 `localStorage` 中获取保存的 JWT token。
- **附加 token**：如果存在 token，将其附加到请求头的 `Authorization` 字段中，格式为 `Bearer ${token}`。这通常用于身份验证，确保请求携带有效的认证信息。
- **返回修改后的配置**：返回修改后的请求配置，继续发送请求。
- **处理错误**：如果请求拦截器遇到错误，返回一个被拒绝的 promise，以便在调用代码中处理。

```javascript
axiosInstance.interceptors.request.use(
  function (config) {
    // Get the token from wherever you stored it after login
    const token = localStorage.getItem("jwt_token");
    // Attach the token to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
```

#### 4. 导出 `axios` 实例

- **导出 `axiosInstance`**：导出配置好的 axios 实例，以便在应用的其他部分中使用。
  

```javascript
export default axiosInstance;
```

### EasyTable

`EasyTable` 组件是一个使用 Material-UI 构建的表格组件，支持可选的表头预览、分页以及文本剪裁功能。以下是对该组件的详细分析和实现原理解释：

##### 1. 导入必要的库和组件

- **Material-UI 组件**：导入 Material-UI 提供的表格相关组件。
  
  - `Table`：表格容器。
  - `TableBody`：表格主体。
  - `TableCell`：表格单元格。
  - `TableContainer`：表格容器，用于包裹整个表格。
  - `TableHead`：表格头部。
  - `TableRow`：表格行。
  - `TablePagination`：表格分页组件。
  - `Container`：用于包裹整个表格和分页组件。
- **useState**：React 的钩子，用于管理组件状态。
  

```javascript
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Container,
} from "@mui/material";
import { useState } from "react";
```

##### 2. 定义 `EasyTable` 组件

- **组件属性**：
  
  - `rows`：表格数据，每行是一个对象。
  - `previewHeader`：是否显示预览表头（默认为 `false`）。
  - `headerList`：预览表头的列表。
  - `maxTextLen`：单元格中文本的最大长度（默认为 `60`）。
  - `showPagination`：是否显示分页组件（默认为 `true`）。
  - `headerColor`：表头的背景颜色（默认为 `lightgray`）。
- **状态管理**：
  
  - `page`：当前页码（默认为 `0`）。
  - `rowsPerPage`：每页显示的行数（默认为 `5`）。
- **计算表格列名**：
  
  - `keys`：从 `rows` 中提取的列名。

```javascript
export function EasyTable({
  rows,
  previewHeader,
  headerList,
  maxTextLen,
  showPagination,
  headerColor,
}) {
  previewHeader = previewHeader ?? false;
  showPagination = showPagination ?? true;
  headerColor = headerColor ?? "lightgray";
  maxTextLen = maxTextLen ?? 60;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const keys = rows.length > 0 ? Object.keys(rows[0]) : [];
```

##### 3. 文本剪裁函数

- **clipText**：用于剪裁单元格中的文本，如果文本长度超过 `maxTextLen`，则截断并添加省略号。
  

```javascript
  const clipText = (text) => {
    if (text === null) return "null";
    if (text.length > maxTextLen) {
      return text.substring(0, maxTextLen) + "...";
    } else {
      return text;
    }
  };
```

##### 4. 分页处理函数

- **handleChangePage**：处理页码更改，更新 `page` 状态。
- **handleChangeRowsPerPage**：处理每页行数更改，更新 `rowsPerPage` 状态，并重置 `page` 为 `0`。

```javascript
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
```

##### 5. 渲染表格组件

- **表头渲染**：
  
  - 如果 `previewHeader` 为 `true` 且 `keys` 为空，则使用 `headerList` 渲染表头。
  - 否则使用 `keys` 渲染表头。
- **表体渲染**：
  
  - 根据 `page` 和 `rowsPerPage` 状态，截取当前页的行数据进行渲染。
  - 每行的数据通过 `TableRow` 和 `TableCell` 进行渲染，并对单元格文本进行剪裁。
- **分页组件**：
  
  - 如果 `showPagination` 为 `true`，则渲染 `TablePagination` 组件，用于分页控制。

```javascript
  return (
    <Container>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {previewHeader && keys.length == 0
                ? headerList.map((keyName, keyIndex) => (
                    <TableCell
                      sx={{
                        backgroundColor: headerColor,
                      }}
                      key={keyIndex}
                    >
                      {clipText(keyName)}
                    </TableCell>
                  ))
                : keys.map((keyName, keyIndex) => (
                    <TableCell
                      sx={{
                        backgroundColor: headerColor,
                      }}
                      key={keyIndex}
                    >
                      {clipText(keyName)}
                    </TableCell>
                  ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {keys.map((keyName, keyIndex) => (
                    <TableCell
                      key={keyIndex}
                      sx={{
                        maxWidth: "60%",
                        overflow: "hidden",
                        textOverflow: "clip",
                      }}
                    >
                      {clipText(row[keyName])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showPagination ? (
        <TablePagination
          page={page}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      ) : (
        ""
      )}
    </Container>
  );
}
```

### Pages

#### LoginPage

`/login` 界面：在本界面点击登录按钮后，通过 axios 网络框架向后端的对应接口 `/login` 发送登录请求，后端会验证用户名和密码的合法性，合法则返回一个经过 jwt 加密的 token，并要求前端在随后的所有通讯中在请求的 header 部分带上这个 token；如果登录不合法则返回错误信息，拒绝登录。

![](file://C:\Users\gaomengtong\AppData\Roaming\marktext\images\2024-06-29-23-57-31-image.png?msec=1719676651717)

根据作者的描述，登录界面实现原理可以分步骤进行详细解释。以下是逐步的实现原理解释：

##### 1.界面布局与组件初始化

首先需要定义登录界面的布局，包括用户名和密码输入框、登录按钮和一些提示信息。

```jsx
import React, { useState, useContext } from "react";
import axiosInstance from "../AxiosInstance";
import { Alert, Button, Snackbar } from "@mui/material";
import LoginPage, { Username, Password, Submit, Title, Logo, Reset } from "@react-login-page/base";
import { AuthContext } from "../Components/AuthContext";
import LoginLogo from "react-login-page/logo-rect";
import { useNavigate } from "react-router-dom";

export function LoginSignupPage() {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openFeedbackSnackBar, setOpenFeedBackSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
```

##### 2. 状态管理

使用 React 的 `useState` 钩子来管理表单状态和反馈信息：

- **openSnackBar**：控制是否显示空字段提示的 Snackbar。
- **openFeedbackSnackBar**：控制是否显示反馈消息的 Snackbar。
- **errorMessage**：存储错误消息。
- **navigate**：用于页面导航。
- **login**：从 AuthContext 获取的登录函数，用于更新登录状态。

```jsx
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openFeedbackSnackBar, setOpenFeedBackSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
```

##### 3. 表单提交处理

当用户点击登录按钮时，处理表单提交并进行验证。

- **表单验证**：遍历表单数据，如果有空字段则显示提示。
- **发送请求**：使用 axios 发送 POST 请求到后端 `/login` 接口。
- **处理响应**：如果登录成功，保存 JWT token 到 localStorage，更新登录状态，并导航到 `/manage` 界面；如果登录失败，显示错误消息。

```jsx
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    for (var [key, val] of formData.entries()) {
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
```

##### 4. 发送登录请求

通过 axios 框架向后端发送登录请求：

- **请求头**：指定 `Content-Type` 为 `multipart/form-data`，以便发送表单数据。
- **保存 token**：如果登录成功，后端返回 JWT token，前端将其保存到 `localStorage` 中。
- **更新状态和导航**：调用 `login` 函数更新用户状态，并导航到 `/manage` 界面。
- **错误处理**：如果登录失败，显示错误消息。

```jsx
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
```

##### 5. 显示错误信息

使用 Snackbar 和 Alert 组件显示错误提示信息：

- **openSnackBar**：当表单字段为空时显示提示。
- **openFeedbackSnackBar**：当登录失败时显示错误消息。

```jsx
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
```

##### 6. 渲染登录界面

定义表单结构和各个输入组件：

- **Username 和 Password**：用于输入用户名和密码。
- **Submit**：提交按钮。
- **Reset**：重置按钮（可见性设置为 `false`）。
- **Title 和 Logo**：界面标题和 Logo。

```jsx
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
        {/* Snackbars for error messages */}
      </LoginPage>
    </form>
  );
}
```

#### ManagePage

![](file://C:\Users\gaomengtong\AppData\Roaming\marktext\images\2024-06-29-23-59-06-image.png?msec=1719676746165)

`/manage` 界面：本界面主要分为**四个组件**，分别：

1. 显示题目信息的 `DescriptionBlock`
  
2. 输入 SQL 语句的区域 `InputBlock`
  
3. 显示查询结果的 `ResultBlock`
  
4. 显示历史 SQL 语句的 `HistoryBlock`。
  

四个组件通过保存在公共的父亲组件 `ManagementPage` 中的状态同步。

##### 1. 导入必要的库和组件

- **React**：用于构建组件和管理状态。
- **axiosInstance**：配置好的 axios 实例，用于发送 HTTP 请求。
- **Material-UI**：用于构建用户界面。
- **EasyTable**：自定义组件，用于显示表格。
- **AuthContext**：认证上下文，用于管理用户登录状态。
- **GlobalConfigs**：全局配置，包含服务器地址等信息。
- **useNavigate**：React Router 的钩子，用于导航。

```jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import axiosInstance from "../AxiosInstance";
import {
  Grid,
  Container,
  Button,
  Paper,
  TextField,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Card,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemButton,
} from "@mui/material";
import { EasyTable } from "../Components/EasyTable";
import { AuthContext } from "../Components/AuthContext";
import { GlobalConfigs } from "../Config";
import { useNavigate } from "react-router-dom";
```

##### 2. 顶部导航栏组件 `TopAppBar`

- **AuthContext**：用于获取当前用户名。
- **useNavigate**：用于实现页面导航。
- **AppBar** 和 **Toolbar**：用于构建顶部导航栏。
- **Button**：用于实现登出功能，点击后导航到登录页面。

```jsx
function TopAppBar() {
  const { username } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          backgroundColor: "lightgray",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={1}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "black",
              }}
            >
              用户: {username}
            </Typography>
          </Grid>
          <Grid item xs={10}></Grid>
          <Grid
            item
            xs={1}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "gray",
                },
              }}
              onClick={() => {
                navigate("/login");
              }}
            >
              登出
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
```

##### 3. 历史记录表组件 `HistoryTable`

**EasyTable**：用于显示历史记录的表格，包含历史 SQL 语句和执行时间。

```jsx
function HistoryTable({ history }) {
  return (
    <Card
      variant="outlined"
      sx={{
        margin: 2,
      }}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item xs={10}>
          <EasyTable
            rows={history}
            previewHeader={true}
            headerList={["历史 SQL 语句", "执行时间"]}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
```

##### 4. 结果表组件 `ResultTable`

- **EasyTable**：用于显示查询结果的表格。
  

```jsx
function ResultTable({ result }) {
  return (
    <Card
      variant="outlined"
      sx={{
        margin: 2,
      }}
    >
      <EasyTable rows={result} previewHeader={true} headerList={[""]} />
    </Card>
  );
}
```

前端的整体通过 grid 排版，将 css 嵌入到组件中调整组件的具体外观，界面代码的结构大致如下所示：

```jsx
<Grid container direction="column">
  <Grid item xs={1}>
    <TopAppBar />
  </Grid>
  <Grid item container spacing={2} style={{}}>
    <Grid item xs={6}>
      <Grid container direction="column">
        <Grid item xs={5}>
          <DescriptionBlock
            selectedProblem={selectedProblem}
            selectedProblemMarks={selectedProblemMarks}
            triggerSelectedProblemMarks={triggerSelectedProblemMarks}
          />
        </Grid>
        <Grid item xs={5}>
          <ResultTable result={sqlResult} />
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={6}>
      <Grid container direction="column" spacing={4}>
        <Grid item xs={5}>
          <InputBlock
            selectedProblem={selectedProblem}
            selectedProblemMarks={selectedProblemMarks}
            setSQLResult={setSQLResult}
            addHistoryItem={addHistoryItem}
            clearHistory={clearHistory}
            triggerSelectedProblemMarks={triggerSelectedProblemMarks}
            setTriggerSelectedProblemMarks={setTriggerSelectedProblemMarks}
          />
        </Grid>
        <Grid item xs={5}>
          <HistoryTable history={sqlHistory} />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
</Grid>
```

如上面的代码展示的，`/manage` 界面主要分成四个 block，block 之间通过 react 提供的状态沟通。

前端保存的状态包括：题目的列表和具体信息，历史 SQL 语句，查询获得的结果。借助 `react` 框架的生命周期机制，组合这些状态前端能够实现高效的重新渲染。

## 二、后端

#### 1 后端技术概述

本实验中，后端采用 `flask` 实现网络请求服务器，采用 `pymysql` 与服务器的 `mysql` 交互，设计时采用尽可能少的接口数量实现相同的效果，简化系统复杂度。

![](file://C:\Users\gaomengtong\AppData\Roaming\marktext\images\2024-06-29-23-59-40-fd20969309ced1a18036fef88d514e94.png?msec=1719676780898)

- `Flask` ：Flask 是一个轻量级的 WSGI Web 应用框架，由 Python 编写。它基于 Werkzeug WSGI 工具包和 Jinja2 模板引擎。Flask 被设计为可扩展的，并且允许开发者根据自己的需求灵活地使用扩展来添加功能。
  
- `PyMySQL`：PyMySQL 是一个纯 Python 实现的 MySQL 客户端库，允许 Python 程序与 MySQL 数据库进行交互。它是 MySQLdb 的替代品，可以与大多数 MySQL 驱动程序兼容。PyMySQL 的一些主要功能包括：连接数据库、执行SQL语句、事务管理、游标操作和安全化。
  
- 设计原则：在设计后端时，采用了尽可能少的接口数量来实现相同的效果，旨在简化系统的复杂度，提高代码的可维护性和可扩展性。具体来说，后端主要通过以下几个核心接口来实现主要功能：
  
  1. **用户登录**：处理用户身份验证，并返回 JWT token。
  2. **SQL 查询执行**：接收前端传递的 SQL 查询，并返回执行结果。
  3. **答案提交验证**：验证用户提交的答案，并返回验证结果。

#### 2 登录流程

在用户登录的流程中，后端会验证前端发送过来的用户名和密码是否合法。如果合法，则返回一个 JWT 加密的 token，并在随后的所有通讯中检查前端的请求中是否正确附带了这个 token。以下是这个流程的详细解释和代码实现。

**用户登录请求**：前端发送一个包含用户名和密码的 POST 请求到后端的 `/login` 路由。后端在 `/login` 路由中接收请求，并调用 `auth_user` 函数验证用户名和密码是否正确。如果验证通过，则生成 JWT token 并返回给前端。

```python
@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    user_valid = auth_user(username, password)
    if user_valid:
        token = jwt.encode({
            'username': username,
            'password': password,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'status': 'Logged in successfully', 'token': token}), 200
    else:
        return jsonify({'status': 'Invalid username or password'}), 401
```

**生成和返回 JWT token**：在登录成功后，后端会生成一个包含用户名和密码的 JWT token，并设置一个过期时间。生成的 token 会作为响应返回给前端。

**检查请求中的 JWT token**：在随后的请求中，前端需要在请求头部包含这个 JWT token。后端使用一个装饰器 `token_required` 来检查请求是否附带了合法的 token。这个装饰器会在被装饰的函数执行前进行验证。

##### token_required 装饰器

```python
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data['username']
            current_password = data['password']
        except:
            return jsonify({'message': 'Token is invalid!'}), 403
        return f(current_user, current_password, *args, **kwargs)
    return decorated
```

1. **获取请求头中的 token**：
  
  ```python
  token = request.headers.get('Authorization')
  ```
  
  - 从请求头中获取 `Authorization` 字段的值。如果没有找到 token，返回 403 错误。
2. **解析和验证 token**：
  
  ```python
  token = token.split(' ')[1]
  data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
  current_user = data['username']
  current_password = data['password']
  ```
  
  - 从 `Authorization` 字段中提取实际的 token 部分。
  - 使用 `jwt.decode` 函数解码 token，并验证其有效性。如果解码失败，返回 403 错误。
  - 提取 token 中的用户名和密码。
3. **执行被装饰的函数**：
  
  ```python
  return f(current_user, current_password, *args, **kwargs)
  ```
  
  - 在验证通过后，将当前用户的用户名和密码作为参数传递给被装饰的函数。

**使用装饰器保护接口**：

在需要保护的接口中，使用 `@token_required` 装饰器。这样可以确保只有附带合法 token 的请求才能执行这些接口。

##### 示例接口

```python
@app.route('/performSQLQuery', methods=['POST'])
@token_required
def perform_sql_query(current_user, current_password):
  ...
```

#### 3 接口保护

使用 `token_required` 装饰器保护接口，确保用户的请求是合法的。

具体代码实现方法如下：

1. **路由和装饰器**：
  
  - `@app.route('/performSQLQuery', methods=['POST'])`：定义了一个 POST 请求的路由 `/performSQLQuery`。
  - `@token_required`：使用装饰器验证请求是否附带了合法的 JWT token，以确保请求的合法性。
2. **获取 SQL 语句和提交标志**：从请求的 JSON 数据中获取 SQL 语句 `sql` 和提交标志 `commit`。`sql` 是要执行的 SQL 查询语句，`commit` 标志是否需要提交事务。
  
3. **数据库连接**：
  
  - 使用 `pymysql.connect` 函数连接到 MySQL 数据库，使用当前用户的用户名和密码进行身份验证。
  - `cursorclass=pymysql.cursors.DictCursor` 指定游标类型为字典游标，以便返回的结果集是字典形式。
4. **执行 SQL 语句**：创建游标对象 `cursor` 并执行传递的 SQL 语句 `sql`。
  
5. **提交事务**：如果 `commit` 标志为 `1`，则提交事务。提交事务将所有待处理的数据库更改保存到数据库中。
  
6. **获取查询结果和受影响的行数**：
  
  - 使用 `cursor.fetchall()` 获取查询结果，返回结果集。
  - 使用 `cursor.rowcount` 获取受影响的行数。
7. **返回结果**：将查询结果 `result` 和受影响的行数 `affected_rows` 作为 JSON 格式的响应返回，HTTP 状态码为 `200`。
  
8. **异常处理和连接关闭**：捕获并处理异常，返回错误信息和 HTTP 状态码 `401`；无论是否发生异常，最终都会关闭数据库连接，释放资源。
  

```python
@app.route('/performSQLQuery', methods=['POST'])
@token_required
def perform_sql_query(current_user, current_password):
  sql = request.json['sql']
  commit = request.json['commit']
  try:
    connection = pymysql.connect(host='localhost',
                                 user=current_user,
                                 password=current_password,
                                 database=f'db_{current_user}',
                                 cursorclass=pymysql.cursors.DictCursor)
    with connection.cursor() as cursor:
      cursor.execute(sql)
      if commit == 1:
        connection.commit()
      result = cursor.fetchall()
      affected_rows = cursor.rowcount
      return jsonify({'result': result, 'affected_rows': affected_rows}), 200
  except Exception as e:
    print(f'Error: {e}')
    return jsonify({'message': 'SQL query failed!', 'status': str(e)}), 401
  finally:
    connection.close()
```

#### 4 数据库交互

确保了用户的请求是合法的后，我们通过 `pymysql` 提供的接口函数与服务器上的 `mysql` 交互。在创建用户时，我们为每一个用户在 `mysql` 中创建了一个单独的数据库 `db_{username}` ，并且将这个数据库上的所有权限给予新用户；对于别的数据库，我们仅将 `Pub` 公共数据库的 `SELECT` 权限给予了用户，通过 `mysql` 的权限管理保证了数据的安全。

##### 用户数据库创建和权限分配

`create_student_user` 函数用于在 MySQL 数据库中创建新用户，并为其分配相应的权限。通过这些操作，新用户可以在公共数据库中读取数据，并在其专属数据库中执行各种操作，确保数据的安全性和访问控制的灵活性。

4o

1. **连接到 MySQL 数据库**：
  
  - 使用 `pymysql.connect` 函数连接到 MySQL 数据库，使用 root 用户进行身份验证。
    
  - `cursorclass=pymysql.cursors.DictCursor` 指定游标类型为字典游标，以便返回的结果集是字典形式。
    
2. **创建新用户**：构建 `CREATE USER` SQL 语句，创建一个新的 MySQL 用户，使用提供的 `username` 和 `password` 进行身份验证。
  
3. **授予公共数据库权限**：构建 `GRANT SELECT` SQL 语句，授予新用户对公共数据库 `Pub` 的 `SELECT` 权限。这允许新用户读取 `Pub` 数据库中的数据。
  
4. **创建用户专属数据库**：构建 `CREATE DATABASE` SQL 语句，创建一个新的数据库，命名为 `db_{username}`，其中 `{username}` 是新用户的用户名。
  
5. **创建记录表**：构建 `CREATE TABLE AS SELECT` SQL 语句，在新数据库中创建一个表 `qtable`，并将 `sqlschool.qtable` 表的结构和数据复制到 `qtable` 表中。
  
6. **提交更改**：提交以上所有更改，确保创建用户、授予权限、创建数据库和表的操作被保存到数据库中。
  
7. **授予新数据库权限**：构建 `GRANT ALL PRIVILEGES` SQL 语句，授予新用户对其专属数据库 `db_{username}` 的所有权限。这允许新用户在其数据库中执行所有操作，包括插入、更新、删除和查询数据；再次提交更改，确保权限分配操作被保存到数据库中。
  
8. **返回结果和异常处理**：
  
  - 如果所有操作成功，返回 `True` 表示用户创建和权限分配成功。
  - 如果发生异常，捕获异常并打印错误信息，返回 `False` 表示操作失败。
  - 无论操作是否成功，最终都会关闭数据库连接，释放资源。

```python
def create_student_user(username, password):
  try:
    connection = pymysql.connect(host='localhost',
                                 user='root',
                                 password='123456',
                                 database='mysql',
                                 cursorclass=pymysql.cursors.DictCursor)
    with connection.cursor() as cursor:
      create_user_query = f"CREATE USER '{username}'@'localhost' IDENTIFIED BY '{password}';"
      cursor.execute(create_user_query)
      grant_privileges_query1 = f"GRANT SELECT ON Pub.* TO '{username}'@'localhost';"
      cursor.execute(grant_privileges_query1)
      create_database_query = f"CREATE DATABASE db_{username};"
      cursor.execute(create_database_query)
      create_record_table_query = f"create table db_{username}.qtable as select * from sqlschool.qtable;"
      cursor.execute(create_record_table_query)
      connection.commit()
      grant_privileges_query3 = f"GRANT ALL PRIVILEGES ON db_{username}.* TO '{username}'@'localhost';"
      cursor.execute(grant_privileges_query3)
      connection.commit()
      return True
  except Exception as e:
    print(f'Error: {e}')
    return False
  finally:
    connection.close()

```

#### 5 提交答案验证

在判断用户提交正确性时，用户向后端提交检查正确性的题号，后端通过 root 账号登录到 mysql，通过 sql 查询语句：

```mysql
select * from {user_answer} except select * from {standard_answer}; 
```

检查得到的结果条数，如果条数不为零，返回结果条数为错误的条数；如果得到的结果为零，再检查 `user_answer` 和 `standard_answer` 的行数，如果相等则返回正确，否则计算两者的差，和错误条数一起返回。

##### handle_submit 接口

这一部分接口用于验证用户提交的答案是否正确，并返回验证结果。如果答案正确，将更新用户的分数。具体代码如下所示：

```python
@app.route('/submit', methods=["POST"])
@token_required
def handle_submit(current_username, current_password):
  # compare the table that keeps the answer in db_{username} and sqlschool
  # if the result is correct, give full marks to the specified user
  tid = request.json['tid']
  try:
    connection = pymysql.connect(host='localhost',
                                 user='root',
                                 password='123456',
                                 database='mysql',
                                 cursorclass=pymysql.cursors.DictCursor)
    with connection.cursor() as cursor:
      # If the connection if valid, the user is true
      sql = f"select * from sqlschool.qtable where tid={tid}"
      cursor.execute(sql)

      result = cursor.fetchall()[0]
      sql_result_table = result['ttable']
      user_result_table = f"db_{current_username}.{sql_result_table.split('.')[1]}"
      sql = f"select * from {user_result_table} except select * from {sql_result_table}"
      cursor.execute(sql)

      result = cursor.fetchall()
      user_minus_result = len(result)

      # rows from the answer
      sql = f"select * from {sql_result_table}"
      cursor.execute(sql)
      result = cursor.fetchall()
      result_rows = len(result)

      # rows from the user
      sql = f"select * from {user_result_table}"
      cursor.execute(sql)
      result = cursor.fetchall()
      user_rows = len(result)

      if user_minus_result == 0 and result_rows == user_rows:
        # all the results are correct
        # update the score of the user
        sql = f"update db_{current_username}.qtable set tuscore=tscore where tid={tid}"
        cursor.execute(sql)
        connection.commit()

      return jsonify({'wrong_rows': user_minus_result, 'fewer_rows': result_rows-user_rows}), 200

  except Exception as e:
    print(f'Error: {e}')
    return jsonify({'message': str(e)}), 401
  finally:
    connection.close()
```

下面进一步解释实现原理：

1. **路由和装饰器**：
  
  - `@app.route('/submit', methods=["POST"])`：定义了一个 POST 请求的路由 `/submit`。
  - `@token_required`：使用装饰器验证请求是否附带了合法的 JWT token，以确保请求的合法性。
2. **获取题目 ID**：
  
  - `tid = request.json['tid']`：从请求的 JSON 数据中获取题目 ID `tid`。
3. **数据库连接**：
  
  - 使用 `pymysql.connect` 函数连接到 MySQL 数据库，使用 root 用户进行连接。
  - `cursorclass=pymysql.cursors.DictCursor`：指定游标类型为字典游标，以便返回的结果集是字典形式。
4. **查询标准答案表**：执行查询以获取指定题目的标准答案表名 `ttable`。
  
  ```python
  sql = f"select * from sqlschool.qtable where tid={tid}"
  cursor.execute(sql)
  result = cursor.fetchall()[0]
  sql_result_table = result['ttable']
  ```
  
5. **比较用户答案和标准答案**：构建用户答案表名 `user_result_table`，执行 SQL 语句比较用户答案和标准答案，获取用户答案中不在标准答案中的记录数 `user_minus_result`。
  
  ```python
  user_result_table = f"db_{current_username}.{sql_result_table.split('.')[1]}"
  sql = f"select * from {user_result_table} except select * from {sql_result_table}"
  cursor.execute(sql)
  result = cursor.fetchall()
  user_minus_result = len(result)
  ```
  
6. **获取标准答案和用户答案的行数**：
  
  - 获取标准答案表 `sql_result_table` 的行数 `result_rows`。
  - 获取用户答案表 `user_result_table` 的行数 `user_rows`。
  
  ```python
  sql = f"select * from {sql_result_table}"
  cursor.execute(sql)
  result = cursor.fetchall()
  result_rows = len(result)
  
  sql = f"select * from {user_result_table}"
  cursor.execute(sql)
  result = cursor.fetchall()
  user_rows = len(result)
  ```
  
7. **验证答案并更新分数**：如果用户答案和标准答案的差异为零且行数相同，则认为答案正确，更新用户的分数 `tuscore`。
  
  ```python
  if user_minus_result == 0 and result_rows == user_rows:
      sql = f"update db_{current_username}.qtable set tuscore=tscore where tid={tid}"
      cursor.execute(sql)
      connection.commit()
  ```
  
8. **返回验证结果**：返回验证结果，包括错误的行数 `wrong_rows` 和缺少的行数 `fewer_rows`。
  
  ```python
  return jsonify({'wrong_rows': user_minus_result, 'fewer_rows': result_rows-user_rows}), 200
  ```
  
9. **异常处理和连接关闭**：捕获并处理异常，返回错误信息；最后关闭数据库连接。
  
  ```python
  except Exception as e:
      print(f'Error: {e}')
      return jsonify({'message': str(e)}), 401
  finally:
      connection.close()
  ```
  

## 三、可测试题目

### 1 数据库和表结构

在进行题目添加前，需要确保数据库和表的结构符合要求。以下是所需的表：

1. `qtable` - 用于存储题目信息
2. `student_info` - 用于存储学生信息
3. `courses` - 用于存储课程信息
4. `student_courses` - 用于存储学生选课信息

![](file://C:\Users\gaomengtong\AppData\Roaming\marktext\images\2024-06-30-00-01-50-image.png?msec=1719676910672)

#### 创建表结构

- 创建 qtable 表
  
  ```sql
  CREATE TABLE qtable (
      tid INT PRIMARY KEY,
      tfirst VARCHAR(255),
      tlast VARCHAR(255),
      ttitle VARCHAR(255),
      ttext TEXT,
      tdate DATE,
      tscore INT,
      ttable VARCHAR(255),
      tuscore INT
  );
  ```
  
- 创建 student_info 表
  
  ```sql
  CREATE TABLE student_info (
      sid VARCHAR(12) PRIMARY KEY,
      sname VARCHAR(255),
      sclass INT,
      sdepart VARCHAR(255)
  );
  ```
  
- 创建 courses 表
  
  ```sql
  CREATE TABLE courses (
      course_id INT PRIMARY KEY,
      course_name VARCHAR(255) NOT NULL
  );
  ```
  
- 创建 student_courses 表
  
  ```sql
  CREATE TABLE student_courses (
      sid VARCHAR(12),
      course_id INT,
      course_score INT,
      PRIMARY KEY (sid, course_id),
      FOREIGN KEY (sid) REFERENCES student_info(sid),
      FOREIGN KEY (course_id) REFERENCES courses(course_id)
  );
  ```
  

#### 插入示例数据

- 插入示例数据到 student_info 表
  
  ```sql
  INSERT INTO student_info (sid, sname, sclass, sdepart) VALUES
  ('202100130000', '张三', 1, '计算机科学与技术学院'),
  ('202100130001', '张四', 1, '计算机科学与技术学院'),
  ('202100130002', '张五', 2, '计算机科学与技术学院'),
  ('202100130003', '张六', 2, '计算机科学与技术学院');
  ```
  
- 插入示例数据到 courses 表
  
  ```sql
  INSERT INTO courses (course_id, course_name) VALUES
  (1, '操作系统'),
  (2, '数据结构'),
  (3, '计算机网络'),
  (4, '数据库系统'),
  (5, '离散数学'),
  (6, '高等数学');
  ```
  
- 插入示例数据到 student_courses 表
  
  ```sql
  INSERT INTO student_courses (sid, course_id, course_score) VALUES
  ('202100130000', 1, 85),
  ('202100130000', 2, 90),
  ('202100130001', 3, 78),
  ('202100130001', 4, 88),
  ('202100130002', 5, 95),
  ('202100130002', 1, 76),
  ('202100130003', 2, 82),
  ('202100130003', 3, 80),
  ('202100130002', 6, 70),
  ('202100130003', 6, 65),
  ('202100130000', 6, 55);
  ```
  

### 2 题目及标准答案

![](file://C:\Users\gaomengtong\AppData\Roaming\marktext\images\2024-06-30-00-01-02-image.png?msec=1719676862211)

#### 题目1-1：统计每一门课程的平均分

统计每一门课程的平均分，计算所有学生在每门课程中的平均成绩。

**SQL 语句：**

```sql
SELECT course_name, AVG(course_score) AS avg_score
FROM courses
JOIN student_courses ON courses.course_id = student_courses.course_id
GROUP BY course_name;
```

**插入新的题目描述：`qtable`**

```sql
INSERT INTO qtable (tid, tfirst, tlast, ttitle, ttext, tdate, tscore, ttable, tuscore)
VALUES (1, NULL, NULL, '习题1-1', '统计每一门课程的平均分', NULL, 5, 'sqlschool.test1_1', 0);
```

**标准答案存储表：`sqlschool.test1_1`**

```sql
-- 创建标准答案表
CREATE TABLE sqlschool.test1_1 (
    course_name VARCHAR(255),
    avg_score FLOAT
);

-- 插入正确答案
INSERT INTO sqlschool.test1_1 (course_name, avg_score)
SELECT course_name, AVG(course_score) AS avg_score
FROM courses
JOIN student_courses ON courses.course_id = student_courses.course_id
GROUP BY course_name;
```

#### 题目1-2：统计每人所选的总学分

统计每个学生所选的总学分，计算每个学生选修的所有课程的总学分。

**SQL 语句：**

```sql
SELECT sname, SUM(course_score) AS total_score
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
GROUP BY sname;
```

**插入新的题目描述：`qtable`**

```sql
INSERT INTO qtable (tid, tfirst, tlast, ttitle, ttext, tdate, tscore, ttable, tuscore)
VALUES (2, NULL, NULL, '习题1-2', '统计每人所选的总学分', NULL, 5, 'sqlschool.test1_2', 0);
```

**标准答案存储表：`sqlschool.test1_2`**

```sql
-- 创建标准答案表
CREATE TABLE sqlschool.test1_2 (
    sname VARCHAR(255),
    total_score INT
);

-- 插入正确答案
INSERT INTO sqlschool.test1_2 (sname, total_score)
SELECT sname, SUM(course_score) AS total_score
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
GROUP BY sname;
```

#### 题目1-3：查找每一门课程的最高分

查找每一门课程的最高分，获取所有学生在每门课程中的最高成绩。

**SQL 语句：**

```sql
SELECT course_name, MAX(course_score) AS max_score
FROM courses
JOIN student_courses ON courses.course_id = student_courses.course_id
GROUP BY course_name;
```

**插入新的题目描述：`qtable`**

```sql
INSERT INTO qtable (tid, tfirst, tlast, ttitle, ttext, tdate, tscore, ttable, tuscore)
VALUES (3, NULL, NULL, '习题1-3', '查找每一门课程的最高分', NULL, 5, 'sqlschool.test1_3', 0);
```

**标准答案存储表：`sqlschool.test1_3`**

```sql
-- 创建标准答案表
CREATE TABLE sqlschool.test1_3 (
    course_name VARCHAR(255),
    max_score INT
);

-- 插入正确答案
INSERT INTO sqlschool.test1_3 (course_name, max_score)
SELECT course_name, MAX(course_score) AS max_score
FROM courses
JOIN student_courses ON courses.course_id = student_courses.course_id
GROUP BY course_name;
```

#### 题目2-1：查找人工智能学院1班的同学

查找人工智能学院1班的所有学生，获取这些学生的姓名。

**SQL 语句：**

```sql
SELECT sname
FROM student_info
WHERE sclass = 1 AND sdepart = '人工智能学院';
```

**插入新的题目描述：`qtable`**

```sql
INSERT INTO qtable (tid, tfirst, tlast, ttitle, ttext, tdate, tscore, ttable, tuscore)
VALUES (4, NULL, NULL, '习题2-1', '查找人工智能学院1班的同学', NULL, 5, 'sqlschool.test2_1', 0);
```

**标准答案存储表：`sqlschool.test2_1`**

```sql
-- 创建标准答案表
CREATE TABLE sqlschool.test2_1 (
    sname VARCHAR(255)
);

-- 插入正确答案
INSERT INTO sqlschool.test2_1 (sname)
SELECT sname
FROM student_info
WHERE sclass = 1 AND sdepart = '人工智能学院';
```

#### 题目2-2：查找人工智能学院选修离散数学的同学

查找人工智能学院选修离散数学课程的所有学生，获取这些学生的姓名。

**SQL 语句：**

```sql
SELECT sname
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
JOIN courses ON student_courses.course_id = courses.course_id
WHERE courses.course_name = '离散数学' AND student_info.sdepart = '人工智能学院';
```

**插入新的题目描述：`qtable`**

```sql
INSERT INTO qtable (tid, tfirst, tlast, ttitle, ttext, tdate, tscore, ttable, tuscore)
VALUES (5, NULL, NULL, '习题2-2', '查找人工智能学院选修离散数学的同学', NULL, 5, 'sqlschool.test2_2', 0);
```

**标准答案存储表：`sqlschool.test2_2`**

```sql
-- 创建标准答案表
CREATE TABLE sqlschool.test2_2 (
    sname VARCHAR(255)
);

-- 插入正确答案
INSERT INTO sqlschool.test2_2 (sname)
SELECT sname
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
JOIN courses ON student_courses.course_id = courses.course_id
WHERE courses.course_name = '离散数学' AND student_info.sdepart = '人工智能学院';
```

#### 题目2-3：查询某学院学生的课程成绩

查询“计算机科学与技术学院”所有学生的课程成绩，获取这些学生的姓名、课程名称及成绩。

**SQL 语句：**

```sql
SELECT student_info.sname, courses.course_name, student_courses.course_score
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
JOIN courses ON student_courses.course_id = courses.course_id
WHERE student_info.sdepart = '计算机科学与技术学院';
```

**插入新的题目描述：`qtable`**

```sql
INSERT INTO qtable (tid, tfirst, tlast, ttitle, ttext, tdate, tscore, ttable, tuscore)
VALUES (6, NULL, NULL, '习题2-3', '查询某学院学生的课程成绩', NULL, 5, 'sqlschool.test2_3', 0);
```

**标准答案存储表：`sqlschool.test2_3`**

```sql
-- 创建标准答案表
CREATE TABLE sqlschool.test2_3 (
    sname VARCHAR(255),
    course_name VARCHAR(255),
    course_score INT
);

-- 插入正确答案
INSERT INTO sqlschool.test2_3 (sname, course_name, course_score)
SELECT student_info.sname, courses.course_name, student_courses.course_score
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
JOIN courses ON student_courses.course_id = courses.course_id
WHERE student_info.sdepart = '计算机科学与技术学院';
```

#### 题目2-4：计算“计算机科学与技术学院”2班学生的平均成绩

计算“计算机科学与技术学院”2班学生的平均成绩，获取这些学生在所有课程中的平均分。

**SQL 语句：**

```sql
SELECT AVG(student_courses.course_score) AS average_score
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
WHERE student_info.sclass = 2 AND student_info.sdepart = '计算机科学与技术学院';
```

**插入新的题目描述：`qtable`**

```sql
INSERT INTO qtable (tid, tfirst, tlast, ttitle, ttext, tdate, tscore, ttable, tuscore)
VALUES (7, NULL, NULL, '习题2-4', '计算“计算机科学与技术学院”2班学生的平均成绩。', NULL, 5, 'sqlschool.test2_4', 0);
```

**标准答案存储表：`sqlschool.test2_4`**

```sql
-- 创建标准答案表
CREATE TABLE sqlschool.test2_4 (
    average_score FLOAT
);

-- 插入正确答案
INSERT INTO sqlschool.test2_4 (average_score)
SELECT AVG(student_courses.course_score) AS average_score
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
WHERE student_info.sclass = 2 AND student_info.sdepart = '计算机科学与技术学院';
```

#### 题目3-1：查询所有成绩不及格（低于60分）的学生及其课程信息

查询所有成绩不及格（低于60分）的学生及其课程信息，获取这些学生的姓名、课程名称及成绩。

**SQL 语句：**

```sql
SELECT student_info.sname, courses.course_name, student_courses.course_score
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
JOIN courses ON student_courses.course_id = courses.course_id
WHERE student_courses.course_score < 60;
```

**插入新的题目描述：`qtable`**

```sql
INSERT INTO qtable (tid, tfirst, tlast, ttitle, ttext, tdate, tscore, ttable, tuscore)
VALUES (8, NULL, NULL, '习题3-1', '查询所有成绩不及格（低于60分）的学生及其课程信息。', NULL, 5, 'sqlschool.test3_1', 0);
```

**标准答案存储表：`sqlschool.test3_1`**

```sql
-- 创建标准答案表
CREATE TABLE sqlschool.test3_1 (
    sname VARCHAR(255),
    course_name VARCHAR(255),
    course_score INT
);

-- 插入正确答案
INSERT INTO sqlschool.test3_1 (sname, course_name, course_score)
SELECT student_info.sname, courses.course_name, student_courses.course_score
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
JOIN courses ON student_courses.course_id = courses.course_id
WHERE student_courses.course_score < 60;
```

#### 题目3-2：查询所有选修“高等数学”课程的学生姓名及其所属学院

查询所有选修“高等数学”课程的学生，获取这些学生的姓名及其所属学院。

**SQL 语句：**

```sql
SELECT student_info.sname, student_info.sdepart
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
JOIN courses ON student_courses.course_id = courses.course_id
WHERE courses.course_name = '高等数学';
```

**插入新的题目描述：`qtable`**

```sql
INSERT INTO qtable (tid, tfirst, tlast, ttitle, ttext, tdate, tscore, ttable, tuscore)
VALUES (9, NULL, NULL, '习题3-2', '查询所有选修“高等数学”课程的学生姓名及其所属学院。', NULL, 5, 'sqlschool.test3_2', 0);
```

**标准答案存储表：`sqlschool.test3_2`**

```sql
-- 创建标准答案表
CREATE TABLE sqlschool.test3_2 (
    sname VARCHAR(255),
    sdepart VARCHAR(255)
);

-- 插入正确答案
INSERT INTO sqlschool.test3_2 (sname, sdepart)
SELECT student_info.sname, student_info.sdepart
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
JOIN courses ON student_courses.course_id = courses.course_id
WHERE courses.course_name = '高等数学';
```

#### 题目3-3：统计每个学院选修了至少一门课程的学生人数

统计每个学院选修了至少一门课程的学生人数，获取每个学院中选修了至少一门课程的学生人数。

**SQL 语句：**

```sql
SELECT student_info.sdepart, COUNT(DISTINCT student_info.sid) AS student_count
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
GROUP BY student_info.sdepart;
```

**插入新的题目描述：`qtable`**

```sql
INSERT INTO qtable (tid, tfirst, tlast, ttitle, ttext, tdate, tscore, ttable, tuscore)
VALUES (10, NULL, NULL, '习题3-3', '统计每个学院选修了至少一门课程的学生人数。', NULL, 5, 'sqlschool.test3_3', 0);
```

**标准答案存储表：`sqlschool.test3_3`**

```sql
-- 创建标准答案表
CREATE TABLE sqlschool.test3_3 (
    college_name VARCHAR(255),
    student_count INT
);

-- 插入正确答案
INSERT INTO sqlschool.test3_3 (college_name, student_count)
SELECT student_info.sdepart, COUNT(DISTINCT student_info.sid) AS student_count
FROM student_info
JOIN student_courses ON student_info.sid = student_courses.sid
GROUP BY student_info.sdepart;
```

## 四、改进方向

### 安全性改进

#### 1. 令牌过期和刷新机制

目前，JWT 令牌没有刷新机制。一旦令牌过期，用户需要重新登录，这会影响用户体验，特别是在令牌过期频率较高的情况下。

##### 解决方案

- **引入刷新令牌**：后端生成两个令牌——一个短期访问令牌和一个长期刷新令牌。访问令牌有效期较短，用于实际的数据访问验证。刷新令牌有效期较长，仅用于获取新的访问令牌。
  - **短期访问令牌**：用于保护 API 请求的安全，通常有效期为 15 分钟到 1 小时。
  - **长期刷新令牌**：用于获取新的访问令牌，通常有效期为数天到数周。
- **前端实现**：在访问令牌即将过期时，使用刷新令牌向后端请求新的访问令牌。
  - **自动刷新**：前端可以设置一个定时器，在访问令牌快要过期时，自动发送请求获取新令牌。
  - **手动刷新**：用户在访问受保护资源时，如果令牌过期，可以自动跳转到登录页面，提示用户重新登录获取新令牌。
- **后端实现**：
  - **刷新端点**：后端提供一个刷新端点，接受刷新令牌并返回新的访问令牌。
  - **验证刷新令牌**：后端验证刷新令牌的有效性和合法性，确保其未过期且未被篡改。
  - **更新令牌**：生成新的访问令牌，并将其发送回前端。

#### 2. 更安全的存储令牌

JWT 令牌存储在 `localStorage` 中，容易受到 XSS 攻击。如果恶意脚本访问了 `localStorage`，可以窃取令牌，导致用户账户被劫持。

##### 解决方案

- **使用 `httpOnly` 的 cookies**：`httpOnly` cookies 不能被 JavaScript 访问，仅在服务器端进行读取和写入，极大地提高了安全性。
  
  - **设置 `httpOnly` 和 `Secure` 标志**：确保 cookies 只能通过 HTTPS 传输，防止中间人攻击。
    
  - **SameSite 属性**：设置 cookies 的 `SameSite` 属性为 `Strict` 或 `Lax`，防止 CSRF 攻击。
    
  - **后端设置 cookies**：在后端生成 JWT 时，设置 `httpOnly` 和 `Secure` cookies，并发送到前端。
    
    ```python
    from flask import make_response, jsonify
    
    def login():
        response = make_response(jsonify({"message": "Logged in successfully"}))
        response.set_cookie("access_token", access_token, httponly=True, secure=True, samesite='Strict')
        return response
    ```
    
  - **前端不直接处理令牌**：前端不需要直接操作令牌，所有令牌的操作由浏览器自动处理。
    

#### 3. 增强的输入验证

前端和后端都需要进行输入验证，防止 SQL 注入和其他类型的攻击。未经过滤的用户输入可能导致严重的安全漏洞。

##### 解决方案

- **前端验证**：
  
  - **使用验证库**：使用如 `Formik` 和 `Yup` 这样的验证库，确保用户输入的格式和内容符合预期。
    
    ```javascript
    import * as Yup from 'yup';
    
    const validationSchema = Yup.object().shape({
      username: Yup.string().required('用户名是必需的'),
      password: Yup.string().required('密码是必需的').min(8, '密码长度不能少于8个字符'),
    });
    ```
    
  - **实时验证**：在用户输入时进行实时验证，提供即时反馈，提示用户修正错误输入。
    
- **后端验证**：
  
  - **使用适当的验证框架**：在后端使用如 `Express-validator`（对于 Node.js）或 `Flask-WTF`（对于 Flask）等验证框架，确保输入的合法性和安全性。
    
    ```python
    from flask_wtf import FlaskForm
    from wtforms import StringField, PasswordField
    from wtforms.validators import DataRequired, Length
    
    class LoginForm(FlaskForm):
        username = StringField('Username', validators=[DataRequired()])
        password = PasswordField('Password', validators=[DataRequired(), Length(min=8)])
    ```
    
  - **使用 ORM**：使用 ORM（如 SQLAlchemy 或 Sequelize），避免手写 SQL 查询，自动处理 SQL 注入问题。
    
- **输入消毒**：
  
  - **过滤和转义**：对用户输入的数据进行过滤和转义，防止恶意代码注入。
  - **验证和消毒库**：使用专门的验证和消毒库，如 `DOMPurify`，确保输入数据的安全性。

通过上述改进，可以大幅提升系统的安全性，减少潜在的安全风险，提高用户的安全体验和信任度。

### 性能优化

#### 1. 前端性能优化

在前端应用中，不必要的重渲染会导致页面响应速度下降，影响用户体验。每次组件重新渲染都会消耗资源，尤其是在处理大量数据或复杂 UI 时，问题更为明显。

##### 解决方案

- **使用 React 的 `memo` 和 `useCallback` 钩子**：这些钩子用于优化组件性能，减少不必要的渲染。
  
  - **React.memo**：用于将组件包裹起来，仅在其 props 发生变化时重新渲染。适用于纯函数组件。
    
    ```javascript
    import React, { memo } from 'react';
    
    const MyComponent = memo(({ prop1, prop2 }) => {
      // 组件内容
      return <div>{prop1} {prop2}</div>;
    });
    ```
    
  - **useCallback**：用于缓存函数实例，避免在每次渲染时重新创建，适用于传递给子组件的回调函数。
    
    ```javascript
    import React, { useCallback, useState } from 'react';
    
    const MyComponent = () => {
      const [count, setCount] = useState(0);
    
      const increment = useCallback(() => {
        setCount(prevCount => prevCount + 1);
      }, []);
    
      return <button onClick={increment}>Count: {count}</button>;
    };
    ```
    
- **使用 React 的 `useMemo` 钩子**：用于缓存计算结果，避免每次渲染都进行昂贵的计算。
  
  ```javascript
  import React, { useMemo } from 'react';
  
  const MyComponent = ({ items }) => {
    const sortedItems = useMemo(() => {
      return items.sort((a, b) => a.value - b.value);
    }, [items]);
  
    return (
      <ul>
        {sortedItems.map(item => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
    );
  };
  ```
  
- **虚拟滚动**：对于大量数据的展示，使用虚拟滚动（如 `react-window` 或 `react-virtualized`）来只渲染可见区域的元素，提高渲染性能。
  
  ```javascript
  import { FixedSizeList as List } from 'react-window';
  
  const MyList = ({ items }) => (
    <List
      height={150}
      itemCount={items.length}
      itemSize={35}
      width={300}
    >
      {({ index, style }) => <div style={style}>{items[index]}</div>}
    </List>
  );
  ```
  

#### 2. 后端性能优化

后端性能直接影响应用的整体响应时间。未优化的数据库查询和高频访问的数据存储在低效位置，都会导致性能瓶颈。

##### 解决方案

- **使用数据库索引优化查询**：索引可以大大提高数据库查询的速度，尤其是在处理大数据集时。
  
  - **创建索引**：为频繁查询的字段创建索引，例如主键、外键和常用于查询的列。
    
    ```sql
    CREATE INDEX idx_username ON users (username);
    ```
    
- **查询优化**：避免使用低效的查询语句，尽量减少全表扫描，使用优化的 SQL 语句。
  
  - **EXPLAIN 分析**：使用 `EXPLAIN` 命令分析查询计划，找出性能瓶颈。
    
    ```sql
    EXPLAIN SELECT * FROM users WHERE username = 'example';
    ```
    
- **缓存机制**：使用缓存机制如 Redis 存储频繁访问的数据，减少数据库查询次数，提高响应速度。
  
  - **引入 Redis**：在后端引入 Redis，将频繁访问的数据缓存到 Redis 中。
    
    ```python
    import redis
    
    r = redis.Redis(host='localhost', port=6379, db=0)
    r.set('my_key', 'value')
    value = r.get('my_key')
    ```
    
  - **缓存策略**：根据数据的访问频率和变更频率，制定合适的缓存策略，避免缓存失效导致的性能问题。
    
- **使用连接池**：对于数据库连接，使用连接池来管理数据库连接，避免频繁的连接建立和释放，提高数据库访问效率。
  
  - **配置连接池**：在数据库配置中设置连接池参数。
    
    ```python
    from sqlalchemy import create_engine
    engine = create_engine('postgresql://user:password@localhost/dbname', pool_size=20, max_overflow=0)
    ```
    
- **后端代码优化**：尽量减少阻塞操作，使用异步编程模型（如 Python 的 `asyncio` 或 Node.js 的异步 API）来提高后端的并发处理能力。
  
  - **异步编程**：使用异步编程库或框架，优化后端处理效率。
    
    ```python
    import asyncio
    
    async def main():
        await asyncio.gather(task1(), task2(), task3())
    
    asyncio.run(main())
    ```
    

### 用户体验改进

#### 1. 更友好的错误提示

目前的错误提示比较简单，用户无法从中获取详细的错误信息和解决方法。这会影响用户在遇到问题时的体验，增加了他们的困惑和操作难度。

##### 解决方案

- **使用 Material-UI 的 Snackbar 和 Dialog 提供详细的错误信息和解决建议**：
  
  - **Snackbar**：用于显示短暂的错误提示信息，提示用户出现的问题和简要的解决方案。
    
    ```javascript
    import { Snackbar, Alert } from '@mui/material';
    
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    
    const handleError = (errorMessage) => {
      setMessage(errorMessage);
      setOpen(true);
    };
    
    return (
      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="error">
          {message}
        </Alert>
      </Snackbar>
    );
    ```
    
  - **Dialog**：用于显示更详细的错误信息和解决建议，帮助用户理解问题并采取相应的操作。
    
    ```javascript
    import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
    
    const [openDialog, setOpenDialog] = useState(false);
    
    const handleOpenDialog = () => {
      setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };
    
    return (
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>错误提示</DialogTitle>
        <DialogContent>
          <DialogContentText>
            这里是详细的错误信息和解决建议。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>关闭</Button>
        </DialogActions>
      </Dialog>
    );
    ```
    
- **错误分类和分级**：根据错误的严重程度和类型，将错误信息分级，提供不同的提示方式和内容。
  
  - **轻微错误**：使用 Snackbar 提示用户，可以继续操作。
  - **严重错误**：使用 Dialog 提示用户，并提供详细的解决建议。

#### 2. **功能扩展**

- **用户角色和权限管理**：增加不同用户角色和权限管理。
  
  - **解决方案**：在后端实现基于角色的访问控制（RBAC），前端根据用户角色显示不同的功能和界面。
- **更丰富的数据可视化**：提供更丰富的数据可视化选项，如图表和报表。
  
  - **解决方案**：使用数据可视化库如 `D3.js` 或 `Chart.js`，提供多种图表类型和交互功能。
- **离线支持**：实现离线模式，提升用户在网络不稳定情况下的体验。
  
  - **解决方案**：使用 PWA（渐进式网络应用）技术，实现应用的离线支持和缓存功能。

#### 3. **代码质量改进**

- **代码重构**：对现有代码进行重构，提高代码可读性和可维护性。
  
  - **解决方案**：采用更好的代码结构和设计模式，如 MVC 模式和依赖注入，增加代码注释和文档。
- **测试覆盖率**：增加单元测试和集成测试，确保代码的正确性和稳定性。
  
  - **解决方案**：使用测试框架如 `Jest` 和 `React Testing Library`，为前端和后端代码编写全面的测试用例。
- **持续集成和部署**：实现自动化的持续集成和部署流程，提高开发效率和代码质量。
  
  - **解决方案**：使用 CI/CD 工具如 GitHub Actions 或 Jenkins，设置自动化测试、构建和部署流程。
