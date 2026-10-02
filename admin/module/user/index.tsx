import {ListHeader} from "@components/list/ListHeader";
import {ListLayout} from "@components/list/ListLayout";
import {ListPagination} from "@components/list/ListPagination";
import {ListTable} from "@components/list/ListTable";
import {useListUserData} from "@module/user/useUserQueries";
import {Search as SearchIcon} from "@mui/icons-material";
import {
  Avatar,
  InputAdornment,
  TableCell,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import React from "react";

/* =========================
   CONSTANTS
========================= */

const DEFAULT_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iOCI+CjxwYXRoIGQ9Ik04IDBDNS43OTA4NiAwIDQgMS43OTA4NiA0IDRDNCA2LjIwOTE0IDUuNzkwODYgOCA4IDhDMTAuMjA5MSA4IDEyIDYuMjA5MTQgMTIgNEMxMiAxLjc5MDg2IDEwLjIwOTEgMCA4IDBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yIDE0QzIgMTEuNzkwOSA0LjQ2ODYyIDEwIDcuNSAxMEg4LjVDMTEuNTMxNCAxMCAxNCAxMS43OTA5IDE0IDE0VjE2SDJWMTRaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K";

const getAvatarUrl = (avatar?: string | null): string => {
  if (!avatar) return DEFAULT_AVATAR;
  if (avatar.startsWith("http")) {
    try {
      const url = new URL(avatar);
      return url.pathname;
    } catch {
      return DEFAULT_AVATAR;
    }
  }
  return avatar.startsWith("/") ? avatar : `/${avatar}`;
};

/* =========================
   COMPONENT
========================= */

export function User(): JSX.Element {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [orderBy, setOrderBy] = React.useState<"fullName" | "email" | "role">(
    "fullName",
  );
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");

  /* ===== Debounce Search ===== */
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  /* ===== API Params ===== */
  const apiParams = React.useMemo(() => {
    const params: any = {page, perPage: rowsPerPage};
    if (debouncedSearch.trim()) params.keyword = debouncedSearch.trim();
    return params;
  }, [debouncedSearch, page, rowsPerPage]);

  const {data, isLoading, isError} = useListUserData(apiParams);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  /* ===== Sorting ===== */
  const sortedUsers = React.useMemo(() => {
    if (!data?.data) return [];
    const list = [...data.data];
    list.sort((a, b) => {
      const aVal = (a as any)[orderBy] || "";
      const bVal = (b as any)[orderBy] || "";
      return order === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
    return list;
  }, [data?.data, order, orderBy]);

  const handleSort = (field: "fullName" | "email" | "role") => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <ListLayout>
      {/* ===== Header ===== */}
      <ListHeader
        title="Người dùng"
        description="Quản lý tài khoản và quyền truy cập hệ thống CoachBox"
      />

      {/* ===== Toolbar ===== */}
      <div className="mb-4">
        <TextField
          size="small"
          placeholder="Tìm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[320px]"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-gray-400" />
              </InputAdornment>
            ),
          }}
        />
      </div>

      {/* ===== Table ===== */}
      <ListTable
        head={
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === "fullName"}
                direction={order}
                onClick={() => handleSort("fullName")}
              >
                Người dùng
              </TableSortLabel>
            </TableCell>

            <TableCell>
              <TableSortLabel
                active={orderBy === "role"}
                direction={order}
                onClick={() => handleSort("role")}
              >
                Vai trò
              </TableSortLabel>
            </TableCell>
          </TableRow>
        }
        body={
          isLoading ? (
            <TableRow>
              <TableCell colSpan={2} align="center">
                Đang tải dữ liệu…
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={2} align="center">
                Có lỗi xảy ra khi tải dữ liệu
              </TableCell>
            </TableRow>
          ) : sortedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} align="center">
                Không có người dùng
              </TableCell>
            </TableRow>
          ) : (
            sortedUsers.map((u, idx) => (
              <TableRow
                key={idx}
                hover
                className="transition-colors hover:bg-gray-50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={getAvatarUrl(u.avatar)}
                      sx={{width: 40, height: 40}}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                      }}
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {u.fullName}
                      </div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                      ${
                        u.role === "admin"
                          ? "bg-[#36BF9F14] text-[#1B7F6B]"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                  >
                    {u.role === "admin" ? "Admin" : "Người dùng"}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )
        }
      />

      {/* ===== Pagination ===== */}
      <ListPagination
        page={page}
        totalPages={data?.totalPages || 1}
        rowsPerPage={rowsPerPage}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(size) => {
          setRowsPerPage(size);
          setPage(1);
        }}
      />
    </ListLayout>
  );
}
