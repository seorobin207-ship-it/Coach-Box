import ApiUser from "@api/ApiUser";
import {QuizItem} from "@app/types";
import {formatISODate, renderLevelName} from "@app/utils";
import IconSearch from "@components/Icon/IconSearch";
import {ListHeader} from "@components/list/ListHeader";
import {ListLayout} from "@components/list/ListLayout";
import {ListPagination} from "@components/list/ListPagination";
import {ListTable} from "@components/list/ListTable";
import {useQuizList} from "@module/home/useDashboardQueries";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import {
  Avatar,
  Box,
  Button,
  Chip,
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

export interface IListQuestionProps {
  changeTab: (tab: string) => void;
  setQuizId: (quizId: string) => void;
}

/* =========================
   CONSTANTS
========================= */

const LEVELS = [
  {label: "Cơ bản", value: "BEGINNER"},
  {label: "Trung cấp", value: "INTERMEDIATE"},
  {label: "Nâng cao", value: "ADVANCED"},
];

const STATUS_OPTIONS = [
  {label: "Đã xuất bản", value: "published"},
  {label: "Bản nháp", value: "draft"},
];

/* =========================
   COMPONENT
========================= */

export default function ListQuestion({
  changeTab,
  setQuizId,
}: IListQuestionProps) {
  const [level, setLevel] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
      level: level || undefined,
    }),
    [page, rowsPerPage, debouncedSearch, status, level],
  );

  const {data, isLoading} = useQuizList(apiParams);

  const quizzes: QuizItem[] = data?.data || [];
  const totalPages = data?.totalPages || 1;

  /* ===== Reset page on filter ===== */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, level]);

  /* ===== Delete ===== */
  const deleteMutation = useMutation(ApiUser.deleteQuiz, {
    onSuccess: () => queryClient.invalidateQueries("dataListQuiz"),
  });

  /* =========================
     RENDER
  ========================= */

  return (
    <ListLayout>
      {/* ===== Header ===== */}
      <ListHeader
        title="Danh sách câu hỏi"
        description="Quản lý ngân hàng câu hỏi trong hệ thống CoachBox"
        action={{
          label: "Thêm câu hỏi",
          icon: <AddIcon />,
          onClick: () => changeTab("createUpdateLesson"),
        }}
      />

      {/* ===== Filters (GIỮ NGUYÊN LOGIC) ===== */}
      <div className="mb-4 flex flex-col md:flex-row gap-3">
        <OutlinedInput
          size="small"
          placeholder="Tìm kiếm câu hỏi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[320px]"
          startAdornment={
            <InputAdornment position="start">
              <IconSearch className="text-gray-400" />
            </InputAdornment>
          }
        />

        <FormControl size="small" className="w-[200px]">
          <InputLabel>Cấp độ</InputLabel>
          <Select
            value={level}
            label="Cấp độ"
            onChange={(e) => setLevel(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {LEVELS.map((l) => (
              <MenuItem key={l.value} value={l.value}>
                {l.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            <TableCell>Câu hỏi</TableCell>
            <TableCell>Cấp độ</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell align="right" />
          </TableRow>
        }
        body={
          isLoading ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Đang tải dữ liệu…
              </TableCell>
            </TableRow>
          ) : quizzes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <span className="text-sm text-gray-400">Không có câu hỏi</span>
              </TableCell>
            </TableRow>
          ) : (
            quizzes.map((quiz) => (
              <TableRow key={quiz.id} hover>
                <TableCell>
                  <Box className="flex items-center gap-3">
                    <Avatar>{quiz.title.charAt(0)}</Avatar>
                    <div className="font-medium">{quiz.title}</div>
                  </Box>
                </TableCell>

                <TableCell>
                  <span className="text-sm">{renderLevelName(quiz.level)}</span>
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    {formatISODate(quiz.createdAt).date}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatISODate(quiz.createdAt).time}
                  </div>
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium
                               ${
                                 quiz.status === "published"
                                   ? "bg-[#36BF9F14] text-[#1B7F6B]"
                                   : "bg-gray-100 text-gray-600"
                               }`}
                  >
                    {quiz.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                  </span>
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => setQuizId(quiz.id.toString())}
                  >
                    <DriveFileRenameOutlineIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteMutation.mutate(quiz.id)}
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
    </ListLayout>
  );
}
