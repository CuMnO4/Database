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

function InputBlock({
  rowsCount,
  addHistoryItem,
  clearHistory,
  setSQLResult,
  selectedProblem,
  selectedProblemMarks,
  triggerSelectedProblemMarks,
  setTriggerSelectedProblemMarks,
}) {
  rowsCount = rowsCount ?? 10;

  const [inputValue, setInputValue] = useState("");
  const [queryStatus, setQueryStatus] = useState("");

  const handleClearHistory = () => {
    clearHistory();
  };

  const navigate = useNavigate();

  const handleValidate = () => {
    console.log("validate problem tid=%d", selectedProblem.current);
    axiosInstance
      .post(GlobalConfigs.serverHostName + "/submit", {
        tid: selectedProblem.current,
      })
      .then((response) => {
        console.log(response);
        let wrong_rows = response.data["wrong_rows"];
        let fewer_rows = response.data["fewer_rows"];
        if (wrong_rows == 0 && fewer_rows == 0) {
          // the result is validated to be correct
          selectedProblemMarks.current = {
            分值: selectedProblemMarks.current["分值"],
            状态: "完成",
            得分: selectedProblemMarks.current["分值"],
          };
          let status_string =
            "problem where tid=" +
            String(selectedProblem.current) +
            " is correct";
          setQueryStatus(status_string);
          setTriggerSelectedProblemMarks(triggerSelectedProblemMarks + 1);
        } else {
          let status_string =
            String(fewer_rows) +
            " rows fewer than the answer, " +
            String(wrong_rows) +
            " rows are wrong";
          setQueryStatus(status_string);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = () => {
    if (inputValue.trim() !== "") {
      let time = new Date();
      addHistoryItem({
        "历史 SQL 语句": inputValue,
        执行时间: time.toLocaleDateString() + " " + time.toLocaleTimeString(),
      });
      axiosInstance
        .post(GlobalConfigs.serverHostName + "/performSQLQuery", {
          sql: inputValue.trim(),
          commit: 1, // commit each sql by default
        })
        .then((response) => {
          setSQLResult(response.data["result"]);
          let status_string =
            String(response.data["affected_rows"]) + " rows affected.";
          setQueryStatus(status_string);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data["message"] == "Token is invalid!") {
            navigate("/login");
          } else {
            setQueryStatus(error.response.data["status"]);
          }
        });
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        margin: 2,
        paddingY: 1,
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{
          paddingX: 3,
        }}
      >
        <Grid item xs={10}>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            minRows={rowsCount}
            maxRows={rowsCount}
            value={inputValue}
            placeholder={"在这里输入 SQL 语句"}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{
              "& .MuiInputBase-input": {
                fontFamily: "Lucida Console",
                fontSize: "16px",
                // fontWeight: "bold",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                // fontWeight: "bold",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
              "& .MuiInputLabel-root": {
                "&.Mui-focused": {
                  color: "black",
                },
              },
            }}
            InputProps={{
              style: {
                overflowY: "auto",
              },
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Grid container direction="column" spacing={2}>
            {/* <Grid item xs={2}>
              <Button variant="outlined" sx={{ width: "100%" }}>
                回滚
              </Button>
            </Grid> */}
            <Grid item xs={2}>
              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  backgroundColor: "gray",
                  "&:hover": {
                    backgroundColor: "black",
                  },
                }}
                onClick={handleValidate}
              >
                提交
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  backgroundColor: "gray",
                  "&:hover": {
                    backgroundColor: "black",
                  },
                }}
                onClick={handleSubmit}
              >
                执行
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  backgroundColor: "gray",
                  "&:hover": {
                    backgroundColor: "black",
                  },
                }}
                onClick={handleClearHistory}
              >
                清空历史
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ padding: 1 }}>
                <Typography
                  sx={{
                    width: "100%",
                    maxHeight: "150px",
                    display: "flex",
                    overflow: "auto",
                  }}
                  variant="body2"
                  color="black"
                >
                  {queryStatus}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

function DescriptionBlock({
  rowsCount,
  selectedProblem,
  selectedProblemMarks,
  triggerSelectedProblemMarks,
}) {
  rowsCount = rowsCount ?? 6;

  // title for the selected problem
  const [title, setTitle] = useState("");
  // detailed description to the selected problem
  const [description, setDescription] = useState("");
  const [problemList, setProblemList] = useState([]);

  // fetch data from backend starting this page
  useEffect(() => {
    axiosInstance
      .post(GlobalConfigs.serverHostName + "/performSQLQuery", {
        sql: "select * from qtable;", // each user possessed its own qtable in its own database
        commit: 1, // commit the query by default
      })
      .then((response) => {
        console.log(response);
        setProblemList(response.data["result"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClickListButton = (index) => (event) => {
    selectedProblem.current = problemList[index].tid;
    console.log("select problem tid=%d", selectedProblem.current);
    setTitle(problemList[index].ttitle);
    setDescription(problemList[index].ttext);
    selectedProblemMarks.current = {
      分值: problemList[index]["tscore"],
      状态:
        problemList[index]["tscore"] !== problemList[index]["tuscore"]
          ? "未完成"
          : "完成",
      得分: problemList[index]["tuscore"] ?? "0",
    };
  };

  return (
    <Card
      variant="outlined"
      sx={{
        margin: 2,
        paddingY: 1,
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          paddingX: 3,
        }}
      >
        <Grid item xs={8}>
          <Grid container direction="column" spacing={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                multiline
                variant="outlined"
                minRows={rowsCount}
                maxRows={rowsCount}
                value={description}
                label={title}
                disabled
                sx={{
                  "& .MuiInputBase-input": {
                    color: "inherit",
                  },
                  "& .MuiInputLabel-root": {
                    color: "inherit",
                  },
                }}
                InputProps={{
                  style: {
                    overflowY: "auto",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Card variant="outlined">
                <EasyTable
                  rows={[selectedProblemMarks.current]}
                  showPagination={false}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container direction="column" spacing={2}>
            <Grid item xs={1}>
              <Typography variant="h6">问题列表</Typography>
            </Grid>
            <Grid item xs={11}>
              <Card variant="outlined" sx={{}}>
                <List
                  style={{
                    maxHeight: "300px",
                    overflow: "auto",
                  }}
                >
                  {problemList.map((problem, problemIndex) => (
                    <ListItem
                      style={{ height: "30px" }}
                      sx={{
                        padding: 0,
                        backgroundColor:
                          problemIndex % 2 == 0 ? "lightgray" : "white",
                      }}
                    >
                      <ListItemButton
                        onClick={handleClickListButton(problemIndex)}
                        style={{ width: "100%", height: "100%" }}
                      >
                        <ListItemText>
                          <Typography
                            style={{
                              fontSize: 12,
                            }}
                          >
                            {problem["ttitle"]}
                          </Typography>
                        </ListItemText>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

export function ManagePage() {
  const [sqlHistory, setSQLHistory] = useState(() => {
    const savedHistory = localStorage.getItem("sqlHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [sqlResult, setSQLResult] = useState([]);
  const [problemList, setProblemList] = useState([]);

  const selectedProblem = useRef(-1);
  const selectedProblemMarks = useRef({
    分值: "空",
    状态: "空",
    得分: "空",
  });
  const [triggerSelectedProblemMarks, setTriggerSelectedProblemMarks] =
    useState(0);

  // flush sqlHistory every time it changes
  useEffect(() => {
    localStorage.setItem("sqlHistory", JSON.stringify(sqlHistory));
  }, [sqlHistory]);

  const addHistoryItem = (newItem) => {
    setSQLHistory((prevHistory) => [newItem, ...prevHistory]);
  };

  const clearHistory = () => {
    localStorage.removeItem("sqlHistory");
    setSQLHistory([]);
  };

  return (
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
  );
}
