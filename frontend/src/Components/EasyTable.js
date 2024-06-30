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

  const clipText = (text) => {
    if (text === null) return "null";
    if (text.length > maxTextLen) {
      return text.substring(0, maxTextLen) + "...";
    } else {
      return text;
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
