import {Table, TableBody, TableContainer, TableHead} from "@mui/material";
import React from "react";

interface ListTableProps {
  head: React.ReactNode;
  body: React.ReactNode;
  empty?: React.ReactNode;
}

export function ListTable({head, body, empty}: ListTableProps) {
  return (
    <TableContainer className="rounded-xl border border-gray-100 overflow-hidden">
      <Table>
        <TableHead className="bg-gray-50">{head}</TableHead>
        <TableBody>{body || empty}</TableBody>
      </Table>
    </TableContainer>
  );
}
