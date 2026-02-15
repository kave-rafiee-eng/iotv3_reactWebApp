import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

import { useTable } from "react-table";
import { useMemo } from "react";

export default function TableProp({ tableData, deleteId }) {
  const COLUMNS = [
    {
      Header: "Date",
      accessor: "Date",
      Cell: ({ value }) => {
        if (!value) return "";

        const date = new Date(value);

        return new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", {
          timeZone: "Asia/Tehran",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(date);
      },
    },
    {
      Header: "value",
      accessor: "value",
    },
    {
      Header: "Delete",
      accessor: "id",
      Cell: ({ value, row }) => (
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={() => {
            deleteId(value);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable({
    columns,
    data: data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer component={Paper}>
        <Table
          {...getTableProps()}
          style={{ border: "1px solid #ddd", width: "100%" }}
          aria-label="sticky table"
        >
          <TableHead sx={{ backgroundColor: "#3b3c3a" }}>
            {headerGroups.map((headerGroup) => {
              const headerGroupProps = headerGroup.getHeaderGroupProps();
              return (
                <TableRow key={headerGroupProps.key} {...headerGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const headerProps = column.getHeaderProps();
                    return (
                      <TableCell
                        key={headerProps.key}
                        {...headerProps}
                        sx={{ color: "#fff", fontWeight: "bold" }}
                      >
                        {column.render("Header")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              const rowProps = row.getRowProps();
              return (
                <TableRow key={rowProps.key} {...rowProps}>
                  {row.cells.map((cell) => {
                    const cellProps = cell.getCellProps();
                    return (
                      <TableCell key={cellProps.key} {...cellProps}>
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
