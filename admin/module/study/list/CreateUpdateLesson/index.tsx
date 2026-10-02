"use client";

import {DEFAULT_IMAGE_PLACEHOLDER, getImageUrl} from "./utils";
import ApiUser, {ICreateCourseData} from "@api/ApiUser";
import Tag from "@app/utils";
import CKEditorWrapper from "@components/CKEditorWrapper";
import {yupResolver} from "@hookform/resolvers/yup";
import {useCourseDetail} from "@module/home/useDashboardQueries";
import ModalAddQuestionCourse from "@module/study/list/ModalAddQuestionCourse";
import {useCategory} from "@module/study/useStudyQueries";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardMedia,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";
import * as yup from "yup";

// Helper function to get image URL and handle CORS issues

// Form validation schema
const schema = yup.object({
  title: yup.string().required("Tiêu đề không được bỏ trống"),
  description: yup.string().required("Mô tả không được bỏ trống"),
  content: yup.string().required("Nội dung không được bỏ trống"),
  categoryId: yup.number().required("Danh mục không được bỏ trống"),
  isActive: yup.boolean().required(),
  quizzes: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required(),
        questions: yup
          .array()
          .of(
            yup.object({
              text: yup.string().required(),
              isMultiple: yup.boolean().required(),
              explanation: yup.string().notRequired(),
              image: yup.string().notRequired(),
              answers: yup
                .array()
                .of(
                  yup.object({
                    text: yup.string().required(),
                    isCorrect: yup.boolean().required(),
                  }),
                )
                .required(),
            }),
          )
          .required(),
      }),
    )
    .required(),
});

type CourseFormData = yup.InferType<typeof schema>;

interface CreateUpdateLessonProps {
  changeTab?: (tab: string) => void;
  courseId?: string;
}

export default function CreateUpdateLesson({
  changeTab,
  courseId,
}: CreateUpdateLessonProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<{
    data: any;
    questionIndex?: number;
    isNewQuestion?: boolean;
  } | null>(null);

  const queryClient = useQueryClient();

  // Load course detail if editing
  const {data: courseDetail, isLoading: isLoadingCourseDetail} =
    useCourseDetail(courseId);

  // Load categories
  const {data: categoriesData, isLoading: isLoadingCategories} =
    useCategory(undefined);

  const createCourseMutation = useMutation(ApiUser.createCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries("dataListCourse");
      if (changeTab) {
        changeTab("listLesson");
      }
    },
    onError: (error) => {
      console.error("Error creating course:", error);
    },
  });

  const updateCourseMutation = useMutation(
    (variables: {id: string; data: ICreateCourseData | FormData}) =>
      ApiUser.updateCourse(variables.id, variables.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("dataListCourse");
        queryClient.invalidateQueries(["courseDetail", courseId]);
        if (changeTab) {
          changeTab("listLesson");
        }
      },
      onError: (error) => {
        console.error("Error updating course:", error);
      },
    },
  );

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
    reset,
  } = useForm<CourseFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      categoryId: 0,
      isActive: false,
      quizzes: [],
    },
  });

  // Transform API data to form format
  const transformApiDataToForm = (apiData: any): CourseFormData => {
    let quizzes = [];

    console.log("🔄 Transforming API data structure:");
    console.log("  - apiData.questions:", !!apiData.questions);
    console.log("  - apiData.quizzes:", !!apiData.quizzes);
    console.log("  - apiData.quizzes length:", apiData.quizzes?.length);

    // Check if API returns questions directly (for existing courses)
    if (
      apiData.questions &&
      Array.isArray(apiData.questions) &&
      apiData.questions.length > 0
    ) {
      // Create a single quiz from the questions
      quizzes = [
        {
          title: "Quiz", // Default title
          explanation: "",
          questions: apiData.questions,
        },
      ];
      console.log(
        "🔄 Used direct questions, created quiz with",
        apiData.questions.length,
        "questions",
      );
    }
    // Otherwise use quizzes if they exist
    else if (apiData.quizzes && Array.isArray(apiData.quizzes)) {
      quizzes = apiData.quizzes;
      console.log("🔄 Used quizzes from API, quiz count:", quizzes.length);
      if (quizzes[0]?.questions) {
        console.log(
          "🔄 First quiz has",
          quizzes[0].questions.length,
          "questions",
        );
      }
    }

    return {
      title: apiData.title || "",
      description: apiData.description || "",
      content: apiData.content || "",
      categoryId: apiData.categoryId || 0,
      isActive: apiData.status === "published",
      quizzes: quizzes,
    };
  };

  // Reset form when API data is loaded
  useEffect(() => {
    if (courseDetail && !isLoadingCourseDetail) {
      console.log("🔍 Raw courseDetail from API:", courseDetail);
      const formData = transformApiDataToForm(courseDetail);
      console.log("📝 Transformed form data:", formData);
      console.log(
        "🔢 Questions count:",
        formData.quizzes[0]?.questions?.length || 0,
      );

      // Store original questions to preserve images
      const questions = formData.quizzes[0]?.questions || [];
      setOriginalQuestions(questions);
      console.log("💾 Stored original questions count:", questions.length);
      console.log(
        "💾 Original questions details:",
        questions.map((q, i) => ({
          index: i,
          id: (q as any).id, // Show question ID
          hasImage: !!q.image,
          image: q.image,
          hasAnswers: !!q.answers,
          answerIds: q.answers?.map((a: any) => a.id) || [], // Show answer IDs
        })),
      );

      reset(formData);

      // Set preview image from backend if exists and reset selected file
      setSelectedFile(null);
      if (courseDetail.image) {
        setPreviewImage(courseDetail.image);
      } else {
        setPreviewImage(null);
      }
    }
  }, [courseDetail, isLoadingCourseDetail, reset]);

  // Store original questions to preserve images when not editing
  const [originalQuestions, setOriginalQuestions] = useState<any[]>([]);

  // Helper function to clean questions data before sending to BE
  const cleanQuestionsForBackend = (questions: any[]) => {
    console.log("🧹 Cleaning questions for backend:");
    console.log("  - Questions to clean:", questions.length);
    console.log("  - Original questions stored:", originalQuestions.length);

    return questions.map((question, index) => {
      const cleanedQuestion = {...question};
      const hasImage = !(
        !cleanedQuestion.image ||
        cleanedQuestion.image === "" ||
        cleanedQuestion.image === null ||
        cleanedQuestion.image === undefined
      );

      console.log(`🧹 Question ${index}:`);
      console.log(`  - Current image: ${cleanedQuestion.image}`);
      console.log(`  - Has image: ${hasImage}`);

      // ✅ PRESERVE ID from original question if editing existing question
      const originalQuestion = originalQuestions[index];
      if (originalQuestion?.id) {
        cleanedQuestion.id = originalQuestion.id;
        console.log(`🆔 Preserved question ID: ${originalQuestion.id}`);
      }

      // ✅ PRESERVE ANSWER IDs if they exist in original
      if (originalQuestion?.answers && cleanedQuestion.answers) {
        cleanedQuestion.answers = cleanedQuestion.answers.map(
          (answer: any, answerIndex: number) => {
            const originalAnswer = originalQuestion.answers[answerIndex];
            if (originalAnswer?.id) {
              return {
                ...answer,
                id: originalAnswer.id, // Preserve answer ID
              };
            }
            return answer;
          },
        );
        console.log(`🆔 Preserved answer IDs for question ${index}`);
      }

      // If image is null/undefined/empty, try to preserve from original
      if (!hasImage) {
        console.log(`  - Original question image: ${originalQuestion?.image}`);

        if (originalQuestion?.image) {
          cleanedQuestion.image = originalQuestion.image;
          console.log(
            `🔄 Preserved original image for question ${index}:`,
            originalQuestion.image,
          );
        } else {
          // No original image, remove the field entirely
          delete cleanedQuestion.image;
          console.log(
            `❌ No original image, removed field for question ${index}`,
          );
        }
      } else {
        console.log(
          `✅ Keeping current image for question ${index}:`,
          cleanedQuestion.image,
        );
      }

      return cleanedQuestion;
    });
  };

  const onSubmit = (data: CourseFormData) => {
    if (courseId) {
      // Update existing course with file upload support
      if (selectedFile) {
        // Create FormData for multipart/form-data request
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description || "");
        formData.append("content", data.content || "");
        formData.append("categoryId", data.categoryId.toString());
        formData.append("status", data.isActive ? "published" : "draft");
        formData.append("image", selectedFile);

        // Convert quizzes to questions format for BE
        if (data.quizzes && data.quizzes.length > 0) {
          const rawQuestions = data.quizzes.flatMap((quiz) => quiz.questions);
          const questions = cleanQuestionsForBackend(rawQuestions);
          console.log("📤 Raw questions:", rawQuestions);
          console.log(
            "📤 Cleaned questions to BE (update with image):",
            questions,
          );
          console.log("📊 Questions count being sent:", questions.length);
          console.log(
            "🆔 Question IDs being sent:",
            questions.map((q) => ({id: q.id, text: q.text?.substring(0, 30)})),
          );
          formData.append("questions", JSON.stringify(questions));
        }

        updateCourseMutation.mutate({id: courseId, data: formData});
      } else {
        // Update without image
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description || "");
        formData.append("content", data.content || "");
        formData.append("categoryId", data.categoryId.toString());
        formData.append("status", data.isActive ? "published" : "draft");

        // Convert quizzes to questions format for BE
        if (data.quizzes && data.quizzes.length > 0) {
          const rawQuestions = data.quizzes.flatMap((quiz) => quiz.questions);
          const questions = cleanQuestionsForBackend(rawQuestions);
          console.log("📤 Raw questions:", rawQuestions);
          console.log(
            "📤 Cleaned questions to BE (update without image):",
            questions,
          );
          console.log("📊 Questions count being sent:", questions.length);
          console.log(
            "🆔 Question IDs being sent:",
            questions.map((q) => ({id: q.id, text: q.text?.substring(0, 30)})),
          );
          formData.append("questions", JSON.stringify(questions));
        }
        updateCourseMutation.mutate({id: courseId, data: formData});
      }
    } else {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description || "");
        formData.append("content", data.content || "");
        formData.append("categoryId", data.categoryId.toString());
        formData.append("status", data.isActive ? "published" : "draft");
        formData.append("image", selectedFile);

        if (data.quizzes && data.quizzes.length > 0) {
          const rawQuestions = data.quizzes.flatMap((quiz) => quiz.questions);
          const questions = cleanQuestionsForBackend(rawQuestions);
          console.log(
            "📤 Cleaned questions to BE (create with image):",
            questions,
          );
          console.log(
            "🆔 Question IDs being sent:",
            questions.map((q) => ({id: q.id, text: q.text?.substring(0, 30)})),
          );
          formData.append("questions", JSON.stringify(questions));
        }

        createCourseMutation.mutate(formData);
      } else {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description || "");
        formData.append("content", data.content || "");
        formData.append("categoryId", data.categoryId.toString());
        formData.append("status", data.isActive ? "published" : "draft");

        if (data.quizzes && data.quizzes.length > 0) {
          const rawQuestions = data.quizzes.flatMap((quiz) => quiz.questions);
          const questions = cleanQuestionsForBackend(rawQuestions);
          console.log(
            "📤 Cleaned questions to BE (create without image):",
            questions,
          );
          console.log(
            "🆔 Question IDs being sent:",
            questions.map((q) => ({id: q.id, text: q.text?.substring(0, 30)})),
          );
          formData.append("questions", JSON.stringify(questions));
        }
        createCourseMutation.mutate(formData);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the actual file for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    // Reset to original image from backend or null
    if (courseDetail?.image) {
      setPreviewImage(courseDetail.image);
    } else {
      setPreviewImage(null);
    }
  };

  const quizzes = watch("quizzes") || [];
  const currentQuiz = quizzes[0] || null; // Luôn làm việc với quiz đầu tiên

  const removeQuestion = (questionIndex: number) => {
    if (!currentQuiz) return;
    const newQuizzes = [...quizzes];
    newQuizzes[0].questions.splice(questionIndex, 1);
    setValue("quizzes", newQuizzes);
  };

  const handleAddQuiz = (data: any) => {
    setIsModalOpen(false);

    console.log("🎯 handleAddQuiz received data:", data);
    console.log("🎯 data.image:", data.image);
    console.log("🎯 editingQuiz:", editingQuiz);

    const newQuestion = {
      text: data.nameQuestion || "",
      isMultiple: false,
      explanation: data.explanation || "",
      image: data.image, // Don't use fallback to "" - keep null/undefined if no image
      answers: [
        {text: data.answerA || "", isCorrect: data.correctAnswer === "A"},
        {text: data.answerB || "", isCorrect: data.correctAnswer === "B"},
        {text: data.answerC || "", isCorrect: data.correctAnswer === "C"},
        {text: data.answerD || "", isCorrect: data.correctAnswer === "D"},
      ],
    };

    if (editingQuiz !== null) {
      if (editingQuiz.questionIndex !== undefined) {
        // Edit question existing
        const newQuizzes = [...quizzes];
        const originalQuestion =
          newQuizzes[0].questions[editingQuiz.questionIndex];
        const originalFromBackend =
          originalQuestions[editingQuiz.questionIndex];

        console.log("📝 Editing question at index:", editingQuiz.questionIndex);
        console.log(
          "📝 Original question image (current):",
          originalQuestion?.image,
        );
        console.log(
          "📝 Original question image (from BE):",
          originalFromBackend?.image,
        );
        console.log("📝 New question image:", newQuestion.image);

        // ✅ PRESERVE QUESTION ID if editing existing
        if (originalFromBackend?.id) {
          (newQuestion as any).id = originalFromBackend.id;
          console.log("🆔 Preserved question ID:", originalFromBackend.id);
        }

        // ✅ PRESERVE ANSWER IDs if editing existing
        if (originalFromBackend?.answers && newQuestion.answers) {
          newQuestion.answers = newQuestion.answers.map(
            (answer, answerIndex) => {
              const originalAnswer = originalFromBackend.answers[answerIndex];
              if (originalAnswer?.id) {
                return {
                  ...answer,
                  id: originalAnswer.id, // Preserve answer ID
                };
              }
              return answer;
            },
          );
          console.log("🆔 Preserved answer IDs for question");
        }

        // If new question has no image but original had one, preserve it
        if (!newQuestion.image && originalFromBackend?.image) {
          newQuestion.image = originalFromBackend.image;
          console.log(
            "🔄 Preserved image from backend:",
            originalFromBackend.image,
          );
        }

        newQuizzes[0].questions[editingQuiz.questionIndex] = newQuestion;
        console.log(
          "📝 Final updated question image:",
          newQuizzes[0].questions[editingQuiz.questionIndex].image,
        );
        setValue("quizzes", newQuizzes);
      } else {
        // Thêm question mới vào quiz hiện có hoặc tạo quiz mới
        if (currentQuiz) {
          const newQuizzes = [...quizzes];
          newQuizzes[0].questions.push(newQuestion);
          setValue("quizzes", newQuizzes);
        } else {
          // Tạo quiz mới với question đầu tiên
          const newQuiz = {
            title: data.nameQuestion || "Quiz mới",
            explanation: data.explanation || "",
            questions: [newQuestion],
          };
          setValue("quizzes", [newQuiz]);
        }
      }
      setEditingQuiz(null);
    } else {
      // Tạo quiz mới (fallback)
      if (currentQuiz) {
        const newQuizzes = [...quizzes];
        newQuizzes[0].questions.push(newQuestion);
        setValue("quizzes", newQuizzes);
      } else {
        const newQuiz = {
          title: data.nameQuestion || "Quiz mới",
          explanation: data.explanation || "",
          questions: [newQuestion],
        };
        setValue("quizzes", [newQuiz]);
      }
    }
  };

  const handleEditQuestion = (questionIndex: number) => {
    if (!currentQuiz || !currentQuiz.questions[questionIndex]) return;

    const question = currentQuiz.questions[questionIndex];
    const correctAnswerIndex = question.answers.findIndex(
      (answer: any) => answer.isCorrect,
    );
    const correctAnswerLetter = ["A", "B", "C", "D"][correctAnswerIndex];

    const editData = {
      nameQuestion: question.text,
      answerA: question.answers[0]?.text || "",
      answerB: question.answers[1]?.text || "",
      answerC: question.answers[2]?.text || "",
      answerD: question.answers[3]?.text || "",
      correctAnswer: correctAnswerLetter,
      explanation: question.explanation || "",
      image: question.image, // Don't use fallback to "" - preserve original value
    };

    console.log("🔧 Editing question:", questionIndex);
    console.log("🔧 Original question.image:", question.image);
    console.log("🔧 editData.image:", editData.image);

    setEditingQuiz({
      data: editData,
      questionIndex,
      isNewQuestion: false,
    });
    setIsModalOpen(true);
  };

  const handleAddQuestionToQuiz = () => {
    setEditingQuiz({
      data: null,
      isNewQuestion: true,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuiz(null);
  };

  const isEditMode = !!courseId;
  const pageTitle = isEditMode ? "Cập nhật bài học" : "Thêm bài học";
  const buttonText = isEditMode ? "Cập nhật bài học" : "Tạo bài học";

  return (
    <>
      <div className="p-4">
        <Box>
          <h4 className="font-bold mb-1 text-2xl">Danh sách bài học</h4>
          <div className="text-gray-500 text-sm">
            <div className="text-gray-400 text-sm flex mt-2">
              <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
              <span className="text-[#212B36]">Bài học</span> <Tag />{" "}
              {pageTitle}
            </div>
          </div>
        </Box>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-4"
      >
        <Accordion defaultExpanded className="mb-4 shadow-sm border">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              <div className="font-semibold text-lg">Chi tiết</div>
              <div className="text-[#637381] font-light">
                Tiêu đề, mô tả ngắn, hình ảnh...
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Controller
              name="title"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  label="Bài học"
                  fullWidth
                  margin="normal"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  placeholder="Vd: Bài học 1"
                  className="border border-[#919EAB52]"
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  label="Mô tả ngắn"
                  multiline
                  rows={4}
                  fullWidth
                  className="border border-[#919EAB52]"
                  margin="normal"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder="Nhập mô tả ngắn về nội dung bài học..."
                />
              )}
            />

            <Controller
              name="categoryId"
              control={control}
              render={({field}) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  className="border border-[#919EAB52]"
                >
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    label="Danh mục"
                    {...field}
                    error={!!errors.categoryId}
                    disabled={isLoadingCategories}
                  >
                    <MenuItem value={0}>Chọn danh mục</MenuItem>
                    {categoriesData?.data?.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.title}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <Typography color="error" variant="caption" sx={{mt: 1}}>
                      {errors.categoryId.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Typography className="font-medium" component="div">
              <div className="mt-4 mb-1 font-medium">Nội dung</div>
            </Typography>
            <Controller
              name="content"
              control={control}
              render={({field}) => (
                <CKEditorWrapper
                  value={field.value || ""}
                  onChange={(data: string) => {
                    field.onChange(data);
                  }}
                  placeholder="Nhập nội dung bài học..."
                />
              )}
            />

            <div className="mt-6 w-full">
              <div className="font-medium mb-2">Hình thu nhỏ</div>
              <input
                accept="image/*"
                className="hidden"
                id="upload-image"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="upload-image" className="w-full">
                <Card
                  className="w-full max-w-md h-48 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400"
                  sx={{
                    backgroundColor: previewImage ? "transparent" : "#f7f7f7",
                  }}
                >
                  {previewImage ? (
                    <CardMedia
                      component="img"
                      image={getImageUrl(previewImage)}
                      alt={selectedFile ? "Ảnh mới được chọn" : "Ảnh hiện tại"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE_PLACEHOLDER;
                      }}
                    />
                  ) : (
                    <Box className="text-center">
                      <Typography className="text-gray-500 mb-2">
                        Kích thước: 700x430 pixel
                      </Typography>
                      <Typography className="text-gray-500">
                        {isEditMode
                          ? "Thay đổi ảnh (JPG, PNG, SVG, WEBP)"
                          : "Tải ảnh lên (JPG, PNG, SVG, WEBP)"}
                      </Typography>
                    </Box>
                  )}
                </Card>
              </label>
              <Typography className="font-light" component="div">
                <div className="flex items-center gap-1 mb-2 mt-2">
                  <InfoIcon fontSize="small" color="disabled" />
                  <span className="break-words">
                    <span className="text-[#212B36] font-semibold">
                      Kích thước:{" "}
                    </span>{" "}
                    700x430 pixel,{" "}
                    <span className="text-[#212B36] font-semibold">
                      {" "}
                      Hỗ trợ tệp:{" "}
                    </span>{" "}
                    JPG, JPEG, PNG, GIF, WEBP
                  </span>
                </div>
                {selectedFile && (
                  <div className="flex items-center justify-between text-green-600 text-sm mt-1">
                    <span>
                      ✓ Đã chọn: {selectedFile.name} (
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Xóa
                    </button>
                  </div>
                )}
                {!selectedFile && courseDetail?.image && previewImage && (
                  <div className="flex items-center justify-between text-blue-600 text-sm mt-1">
                    <span>✓ Ảnh hiện tại từ hệ thống</span>
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Ẩn ảnh
                    </button>
                  </div>
                )}
              </Typography>
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion className="mb-4 shadow-sm border">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              <div className="font-semibold text-lg">Bài kiểm tra</div>
              <div className="text-[#637381] font-light">
                Các câu hỏi trong bài kiểm tra...
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="mb-4">
              {/* Hiển thị danh sách questions */}
              {currentQuiz?.questions && currentQuiz.questions.length > 0 ? (
                currentQuiz.questions.map(
                  (question: any, questionIndex: number) => (
                    <Box
                      key={questionIndex}
                      className="mb-3 border rounded-md p-3 bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-2 flex-1">
                          <IconButton size="small" style={{cursor: "grab"}}>
                            <MenuIcon fontSize="small" />
                          </IconButton>
                          <div className="flex-1">
                            <div className="font-medium">
                              {question?.text || `Câu hỏi ${questionIndex + 1}`}
                            </div>
                            {question?.explanation && (
                              <div className="text-sm text-gray-600 mt-1">
                                Giải thích: {question.explanation}
                              </div>
                            )}
                            {question?.image && (
                              <div className="mt-2">
                                <img
                                  src={getImageUrl(question.image)}
                                  alt="Hình ảnh câu hỏi"
                                  className="w-32 h-20 object-cover rounded border"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = DEFAULT_IMAGE_PLACEHOLDER;
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {!courseId && (
                            <IconButton
                              size="small"
                              onClick={() => removeQuestion(questionIndex)}
                              color="error"
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          )}

                          <IconButton
                            size="small"
                            onClick={() => handleEditQuestion(questionIndex)}
                            color="primary"
                          >
                            <DriveFileRenameOutlineIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                    </Box>
                  ),
                )
              ) : (
                <div className="text-gray-500 text-center py-4 border rounded-md bg-gray-50">
                  Chưa có câu hỏi nào
                </div>
              )}

              {/* Button thêm câu hỏi */}
              {!courseId && (
                <button
                  onClick={() => handleAddQuestionToQuiz()}
                  className="mt-2 bg-[#919EAB14] flex gap-2 w-full items-center justify-center py-2 rounded-lg"
                  type="button"
                >
                  <AddIcon className="text-[#212B36]" />
                  <div className="text-[#212B36] font-semibold">
                    {currentQuiz ? "Thêm câu hỏi" : "Tạo câu hỏi đầu tiên"}
                  </div>
                </button>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Controller
              name="isActive"
              control={control}
              render={({field}) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                    />
                  }
                  label="Xuất bản"
                />
              )}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (changeTab) {
                  changeTab("listLesson");
                }
              }}
              className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-[#212B36] text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-900"
              disabled={
                createCourseMutation.isLoading || updateCourseMutation.isLoading
              }
            >
              {createCourseMutation.isLoading || updateCourseMutation.isLoading
                ? "Đang xử lý..."
                : buttonText}
            </button>
          </div>
        </Box>
      </Box>
      <ModalAddQuestionCourse
        isModalOpen={isModalOpen}
        handleOk={handleAddQuiz}
        handleCancel={handleCloseModal}
        initialData={editingQuiz?.data}
      />
    </>
  );
}
