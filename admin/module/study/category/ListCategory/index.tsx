import ApiUser from "@api/ApiUser";
import {Category} from "@app/types";
import {formatISODate} from "@app/utils";
import IconSearch from "@components/Icon/IconSearch";
import {ListHeader} from "@components/list/ListHeader";
import {ListLayout} from "@components/list/ListLayout";
import {ListPagination} from "@components/list/ListPagination";
import {ListTable} from "@components/list/ListTable";
import {useCategory} from "@module/study/useStudyQueries";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TableCell,
  TableRow,
} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useMutation, useQueryClient} from "react-query";

/* =========================
   TYPES
========================= */

export interface IListCategoryProps {
  changeTab: (tab: string) => void;
  setDataActive: (data: Category) => void;
}

/* =========================
   CONSTANTS
========================= */

const STATUS_OPTIONS = [
  {label: "Đã xuất bản", value: "published"},
  {label: "Bản nháp", value: "draft"},
];

/* =========================
   COMPONENT
========================= */

export default function ListCategory({
  changeTab,
  setDataActive,
}: IListCategoryProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const queryClient = useQueryClient();

  /* ===== Debounce search ===== */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  /* ===== API params ===== */
  const apiParams = useMemo(
    () => ({
      page,
      perPage: rowsPerPage,
      keyword: debouncedSearch || undefined,
      status: status || undefined,
    }),
    [page, rowsPerPage, debouncedSearch, status],
  );

  const {data, isLoading} = useCategory(apiParams);

  const categories: Category[] = data?.data || [];
  const totalPages = data?.totalPages || 1;

  /* ===== Delete ===== */
  const deleteMutation = useMutation(ApiUser.deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("dataCategory");
      setDeleteTarget(null);
    },
  });

  /* ===== Reset page on filter ===== */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  /* =========================
     RENDER
  ========================= */

  return (
    <ListLayout>
      {/* ===== Header ===== */}
      <ListHeader
        title="Danh mục bài học"
        description="Quản lý và phân loại nội dung học tập"
        action={{
          label: "Thêm danh mục",
          icon: <AddIcon />,
          onClick: () => changeTab("createUpdateCategory"),
        }}
      />

      {/* ===== Filters ===== */}
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-3">
        <OutlinedInput
          size="small"
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[320px]"
          startAdornment={
            <InputAdornment position="start">
              <IconSearch className="text-gray-400" />
            </InputAdornment>
          }
        />

        <FormControl size="small" className="w-[160px]">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={status}
            label="Trạng thái"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* ===== Table ===== */}
      <ListTable
        head={
          <TableRow>
            <TableCell>Danh mục</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell align="right" />
          </TableRow>
        }
        body={
          isLoading ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Đang tải dữ liệu…
              </TableCell>
            </TableRow>
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <span className="text-sm text-gray-400">Không có danh mục</span>
              </TableCell>
            </TableRow>
          ) : (
            categories.map((cat) => (
              <TableRow key={cat.id} hover>
                <TableCell className="font-medium capitalize">
                  {cat.title}
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    {formatISODate(cat.createdAt).date}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatISODate(cat.createdAt).time}
                  </div>
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium
                            ${
                              cat.status === "published"
                                ? "bg-[#36BF9F14] text-[#1B7F6B]"
                                : "bg-gray-100 text-gray-600"
                            }`}
                  >
                    {cat.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                  </span>
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setDataActive(cat);
                      changeTab("createUpdateCategory");
                    }}
                  >
                    <DriveFileRenameOutlineIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteTarget(cat)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )
        }
      />

      {/* ===== Pagination ===== */}
      <ListPagination
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(size) => {
          setRowsPerPage(size);
          setPage(1);
        }}
      />

      {/* ===== Delete Dialog ===== */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa danh mục{" "}
            <strong>{deleteTarget?.title}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            className="px-4 py-2 text-sm"
            onClick={() => setDeleteTarget(null)}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 text-sm text-red-600 font-semibold"
            onClick={() =>
              deleteTarget && deleteMutation.mutate(deleteTarget.id)
            }
          >
            Xóa
          </button>
        </DialogActions>
      </Dialog>
    </ListLayout>
  );
}
