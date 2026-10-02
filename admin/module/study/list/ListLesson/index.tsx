import ApiUser from "@api/ApiUser";
import {lessonBanner} from "@app/config/images";
import {Lesson} from "@app/types";
import {formatISODate} from "@app/utils";
import IconSearch from "@components/Icon/IconSearch";
import {ListHeader} from "@components/list/ListHeader";
import {ListLayout} from "@components/list/ListLayout";
import {ListPagination} from "@components/list/ListPagination";
import {ListTable} from "@components/list/ListTable";
import {useCourseList} from "@module/home/useDashboardQueries";
import {useCategory} from "@module/study/useStudyQueries";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import {
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
import Image from "next/image";
import React, {useEffect, useMemo, useState} from "react";
import {useMutation, useQueryClient} from "react-query";

/* =========================
   TYPES
========================= */

export interface IListStudyProps {
  changeTab: (tab: string) => void;
  setCourseId?: (id: string) => void;
}

/* =========================
   CONSTANTS
========================= */

const STATUS_OPTIONS = [
  {label: "Đã xuất bản", value: "published"},
  {label: "Bản nháp", value: "draft"},
];

const getAvatarUrl = (avatar?: string | null): string => {
  if (!avatar) return lessonBanner as unknown as string;
  if (avatar.startsWith("data:") || avatar.startsWith("blob:")) return avatar;
  if (avatar.startsWith("http")) return avatar;
  if (avatar.includes("res.cloudinary.com")) return avatar;
  if (avatar.match(/^v\d+\//))
    return `${process.env.NEXT_PUBLIC_CLOUNDINARY_UPLOAD}/${avatar}`;
  return avatar.startsWith("/") ? avatar : `/${avatar}`;
};

/* =========================
   COMPONENT
========================= */

export default function ListLesson({changeTab, setCourseId}: IListStudyProps) {
  const [category, setCategory] = useState("");
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

  /* ===== API Params ===== */
  const apiParams = useMemo(
    () => ({
      keyword: debouncedSearch || undefined,
      page,
      perPage: rowsPerPage,
      status: status || undefined,
      categoryId: category ? Number(category) : undefined,
    }),
    [debouncedSearch, page, rowsPerPage, status, category],
  );

  const {data: dataCategory} = useCategory(undefined);
  const {data: dataListCourse, isLoading} = useCourseList(apiParams);

  const lessons: Lesson[] = dataListCourse?.data || [];
  const totalPages = dataListCourse?.totalPages || 1;

  /* ===== Delete ===== */
  const deleteMutation = useMutation(ApiUser.deleteCourse, {
    onSuccess: () => queryClient.invalidateQueries("dataListCourse"),
  });

  /* ===== Reset page on filter ===== */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, category]);

  /* =========================
     RENDER
  ========================= */

  return (
    <ListLayout>
      {/* ===== Header ===== */}
      <ListHeader
        title="Danh sách bài học"
        description="Quản lý nội dung học tập trong hệ thống CoachBox"
        action={{
          label: "Thêm bài học",
          icon: <AddIcon />,
          onClick: () => changeTab("createUpdateLesson"),
        }}
      />

      {/* ===== Filters ===== */}
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-3">
        <OutlinedInput
          size="small"
          placeholder="Tìm theo tên bài học..."
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
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={category}
            label="Danh mục"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {dataCategory?.data?.map((c) => (
              <MenuItem key={c.id} value={c.id.toString()}>
                {c.title}
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
            <TableCell>Bài học</TableCell>
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
          ) : lessons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <span className="text-sm text-gray-400">Không có bài học</span>
              </TableCell>
            </TableRow>
          ) : (
            lessons.map((lesson) => (
              <TableRow key={lesson.id} hover>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={getAvatarUrl(lesson.image)}
                      width={40}
                      height={40}
                      alt={lesson.title}
                      className="rounded-xl object-cover"
                    />
                    <div>
                      <div className="font-medium">{lesson.title}</div>
                      <div className="text-xs text-gray-500">
                        {lesson.category.title}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    {formatISODate(lesson.createdAt).date}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatISODate(lesson.createdAt).time}
                  </div>
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium
                    ${
                      lesson.status === "published"
                        ? "bg-[#36BF9F14] text-[#1B7F6B]"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {lesson.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                  </span>
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => setCourseId?.(lesson.id.toString())}
                  >
                    <DriveFileRenameOutlineIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteMutation.mutate(lesson.id)}
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
