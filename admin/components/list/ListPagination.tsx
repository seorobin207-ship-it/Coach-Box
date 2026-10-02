import {MenuItem, Pagination, Select} from "@mui/material";
import React from "react";

interface ListPaginationProps {
  page: number; // 1-based
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (size: number) => void;
}

export function ListPagination({
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: ListPaginationProps) {
  return (
    <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        Hiển thị
        <Select
          size="small"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="w-[72px]"
        >
          {[5, 10, 20].map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </Select>
        / trang
      </div>

      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, p) => onPageChange(p)}
        shape="rounded"
        sx={{
          "& .MuiPaginationItem-root": {
            borderRadius: "10px",
          },
          "& .Mui-selected": {
            backgroundColor: "#36BF9F14 !important",
            color: "#1B7F6B",
            fontWeight: 600,
          },
        }}
      />
    </div>
  );
}
