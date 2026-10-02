import {
  useCourseList,
  useDashboardData,
  useQuizList,
} from "./useDashboardQueries";
import Config from "@app/config";
import {Lesson, QuizItem} from "@app/types";
import {formatISODate, renderLevelName} from "@app/utils";
import IconLesson from "@components/Icon/home/IconLesson";
import IconQuestion from "@components/Icon/home/IconQuestion";
import IconUser from "@components/Icon/home/IconUser";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {useRouter} from "next/router";

export function Home(): JSX.Element {
  const router = useRouter();

  const {data: dashboard} = useDashboardData();
  const {data: courseList} = useCourseList();
  const {data: quizList} = useQuizList();

  const stats = [
    {
      title: "Bài học",
      value: dashboard?.totalCourses ?? 0,
      icon: <IconLesson />,
    },
    {
      title: "Câu hỏi",
      value: dashboard?.totalQuizzes ?? 0,
      icon: <IconQuestion />,
    },
    {
      title: "Người dùng",
      value: dashboard?.totalUsers ?? 0,
      icon: <IconUser />,
    },
  ];

  return (
    <div className="p-6 min-h-screen space-y-8">
      {/* ===== Header ===== */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Tổng quan hoạt động hệ thống học tập CoachBox
        </p>
      </div>

      {/* ===== Stats ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                  {item.value}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 text-green-600">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Main Content ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===== Lessons ===== */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Bài học gần đây</h2>
            <button
              className="flex items-center text-sm font-medium text-green-600 hover:underline"
              onClick={() => router.push(Config.PATHNAME.LESSON)}
            >
              Xem tất cả <ChevronRightIcon fontSize="small" />
            </button>
          </div>

          <div className="space-y-4">
            {courseList?.data.slice(0, 5).map((lesson: Lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-900">{lesson.title}</p>
                  <p className="text-xs text-gray-500">
                    {lesson.category.title}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      lesson.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {lesson.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatISODate(lesson.createdAt).date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Quizzes ===== */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Bài thực hành</h2>
            <button
              className="flex items-center text-sm font-medium text-green-600 hover:underline"
              onClick={() => router.push(Config.PATHNAME.QUIZ)}
            >
              Xem tất cả <ChevronRightIcon fontSize="small" />
            </button>
          </div>

          <div className="space-y-4">
            {quizList?.data.slice(0, 5).map((quiz: QuizItem) => (
              <div
                key={quiz.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-900">{quiz.title}</p>
                  <p className="text-xs text-gray-500">
                    {renderLevelName(quiz.level)} • {quiz.totalQuestions} câu
                    hỏi
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      quiz.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {quiz.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatISODate(quiz.createdAt).date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
