import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Card,
  CardMedia,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import {Modal} from "antd";
import React, {useEffect, useState} from "react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";

// Default placeholder image (a simple gray rectangle SVG data URL)
const DEFAULT_IMAGE_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQzMCIgdmlld0JveD0iMCAwIDcwMCA0MzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNDMwIiBmaWxsPSIjRjNGNEY2Ii8+Cjxzdmcgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgNjQgNjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMzE4IiB5PSIxODMiPgo8cGF0aCBkPSJNNTYgNDhWMTZDNTYgMTMuNzkgNTQuMjEgMTIgNTIgMTJIMTJDOS43OSAxMiA4IDEzLjc5IDggMTZWNDhDOCA1MC4yMSA5Ljc5IDUyIDEyIDUySDUyQzU0LjIxIDUyIDU2IDUwLjIxIDU2IDQ4WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTYgMzJDMTkuMzEzNyAzMiAyMiAyOS4zMTM3IDIyIDI2QzIyIDIyLjY4NjMgMTkuMzEzNyAyMCAxNiAyMEMxMi42ODYzIDIwIDEwIDIyLjY4NjMgMTAgMjZDMTAgMjkuMzEzNyAxMi42ODYzIDMyIDE2IDMyWiIgZmlsbD0iIzY3NzQ4QyIvPgo8cGF0aCBkPSJNOCA0OEw4IDQwTDE2IDMyTDI0IDQwSDMyTDQ4IDI0TDU2IDMyVjQ4SDhaIiBmaWxsPSIjNjc3NDhDIi8+Cjwvc3ZnPgo8L3N2Zz4K";

// Helper function to get image URL and handle CORS issues
const getImageUrl = (image?: string | null): string => {
  if (!image) {
    return DEFAULT_IMAGE_PLACEHOLDER;
  }

  // If it's a base64 data URL or blob URL (from file upload), use as is
  if (image.startsWith("data:") || image.startsWith("blob:")) {
    return image;
  }

  // If image is already a full URL, use as is
  if (image.startsWith("http")) {
    return image;
  }

  // If it's already a Cloudinary URL, avoid duplication
  if (image.includes("res.cloudinary.com")) {
    return image;
  }

  // If it looks like a Cloudinary path (starts with version number)
  if (image.match(/^v\d+\//)) {
    // This is a Cloudinary path, construct full URL
    return `${process.env.NEXT_PUBLIC_CLOUNDINARY_UPLOAD}/${image}`;
  }

  // If it's a relative path, construct it for local storage
  return image.startsWith("/") ? image : `/${image}`;
};

export interface IFormInputs {
  nameQuestion: string;
  category: string;
  points: number;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;
  explanation?: string;
  image?: string | null;
}

interface IModalAddQuestionProps {
  isModalOpen: boolean;
  handleOk: (data: IFormInputs) => void;
  handleCancel: () => void;
  initialData?: IFormInputs;
}

export default function ModalAddQuestionCourse({
  isModalOpen,
  handleOk,
  handleCancel,
  initialData,
}: IModalAddQuestionProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isImageHidden, setIsImageHidden] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<IFormInputs>({
    defaultValues: {
      nameQuestion: "",
      category: "",
      points: 0,
      answerA: "",
      answerB: "",
      answerC: "",
      answerD: "",
      correctAnswer: "A",
      explanation: "",
      image: null,
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      if (initialData) {
        reset(initialData);
        // Properly sync image when editing
        if (initialData.image) {
          setPreviewImage(initialData.image);
        } else {
          setPreviewImage(null);
        }
        setSelectedFile(null);
        setIsImageHidden(false);
      } else {
        reset({
          nameQuestion: "",
          category: "",
          points: 0,
          answerA: "",
          answerB: "",
          answerC: "",
          answerD: "",
          correctAnswer: "A",
          explanation: "",
          image: null,
        });
        setPreviewImage(null);
        setSelectedFile(null);
        setIsImageHidden(false);
      }
      setIsUploadingImage(false);
    }
  }, [isModalOpen, initialData, reset]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert(
          "Định dạng file không được hỗ trợ. Vui lòng chọn file JPG, PNG, GIF, WEBP hoặc SVG.",
        );
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.");
        return;
      }

      setIsUploadingImage(true);
      setSelectedFile(file); // Store the actual file for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setIsUploadingImage(false);
      };
      reader.onerror = () => {
        alert("Có lỗi xảy ra khi đọc file. Vui lòng thử lại.");
        setSelectedFile(null);
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    // ✅ SỬA: Thay vì reset về null, chỉ reset về original image và đánh dấu là hidden
    if (initialData?.image) {
      setPreviewImage(initialData.image);
      setIsImageHidden(true); // Đánh dấu user muốn ẩn ảnh
    } else {
      setPreviewImage(null);
      setIsImageHidden(false);
    }
    // Clear the file input
    const fileInput = document.getElementById(
      "upload-question-image",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    // ✅ SỬA: Handle image properly với logic rõ ràng hơn
    let finalImage: string | null = null;

    if (selectedFile) {
      // New file uploaded - use new image
      finalImage = previewImage;
      console.log("📸 Using new uploaded image");
    } else if (isImageHidden) {
      // User intentionally removed/hid the image
      finalImage = null;
      console.log("📸 User removed image, setting to null");
    } else if (initialData?.image) {
      // Editing existing question with image, preserve original
      finalImage = initialData.image;
      console.log(
        "📸 Preserving original image from initialData:",
        initialData.image,
      );
    } else {
      // No original image and no new image
      finalImage = null;
      console.log("📸 No image to preserve, setting to null");
    }

    console.log("📸 Image handling in modal:");
    console.log("  - selectedFile:", !!selectedFile);
    console.log("  - previewImage:", !!previewImage);
    console.log("  - initialData?.image:", !!initialData?.image);
    console.log("  - isImageHidden:", isImageHidden);
    console.log("  - finalImage:", !!finalImage);

    const submissionData = {
      ...data,
      image: finalImage,
    };
    handleOk(submissionData);
  };

  const handleModalCancel = () => {
    handleCancel();
    reset({
      nameQuestion: "",
      category: "",
      points: 0,
      answerA: "",
      answerB: "",
      answerC: "",
      answerD: "",
      correctAnswer: "A",
      explanation: "",
      image: null,
    });
    setPreviewImage(null);
    setSelectedFile(null);
    setIsUploadingImage(false);
    setIsImageHidden(false);
    // Clear the file input
    const fileInput = document.getElementById(
      "upload-question-image",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <Modal
      title={initialData ? "Chỉnh sửa câu hỏi" : "Tạo câu hỏi"}
      width={700}
      closable={{"aria-label": "Custom Close Button"}}
      open={isModalOpen}
      onOk={handleSubmit(onSubmit)}
      onCancel={handleModalCancel}
      okText={initialData ? "Cập nhật" : "Tạo câu hỏi"}
      cancelText="Hủy bỏ"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="nameQuestion"
          control={control}
          rules={{required: "Câu hỏi là bắt buộc"}}
          render={({field}) => (
            <TextField
              {...field}
              label="Câu hỏi"
              multiline
              rows={4}
              fullWidth
              className="border border-[#919EAB52]"
              margin="normal"
              error={!!errors.nameQuestion}
              helperText={errors.nameQuestion?.message}
            />
          )}
        />
        <Controller
          name="answerA"
          control={control}
          rules={{required: "Đáp án A là bắt buộc"}}
          render={({field}) => (
            <TextField
              {...field}
              placeholder="Nhập đáp án"
              label="Đáp án A"
              fullWidth
              className="border border-[#919EAB52]"
              margin="normal"
              error={!!errors.answerA}
              helperText={errors.answerA?.message}
            />
          )}
        />
        <Controller
          name="answerB"
          control={control}
          rules={{required: "Đáp án B là bắt buộc"}}
          render={({field}) => (
            <TextField
              {...field}
              placeholder="Nhập đáp án"
              label="Đáp án B"
              fullWidth
              className="border border-[#919EAB52]"
              margin="normal"
              error={!!errors.answerB}
              helperText={errors.answerB?.message}
            />
          )}
        />
        <Controller
          name="answerC"
          control={control}
          rules={{required: "Đáp án C là bắt buộc"}}
          render={({field}) => (
            <TextField
              {...field}
              placeholder="Nhập đáp án"
              label="Đáp án C"
              fullWidth
              className="border border-[#919EAB52]"
              margin="normal"
              error={!!errors.answerC}
              helperText={errors.answerC?.message}
            />
          )}
        />
        <Controller
          name="answerD"
          control={control}
          rules={{required: "Đáp án D là bắt buộc"}}
          render={({field}) => (
            <TextField
              {...field}
              placeholder="Nhập đáp án"
              label="Đáp án D"
              fullWidth
              className="border border-[#919EAB52]"
              margin="normal"
              error={!!errors.answerD}
              helperText={errors.answerD?.message}
            />
          )}
        />
        <div className="font-semibold mt-2">Đáp án đúng</div>
        <Controller
          name="correctAnswer"
          control={control}
          rules={{required: "Vui lòng chọn đáp án đúng"}}
          render={({field}) => (
            <div className="flex flex-row justify-start items-center">
              <RadioGroup {...field} row>
                <FormControlLabel
                  value="A"
                  control={<Radio color="success" />}
                  label="Đáp án A"
                />
                <FormControlLabel
                  value="B"
                  control={<Radio color="success" />}
                  label="Đáp án B"
                />
                <FormControlLabel
                  value="C"
                  control={<Radio color="success" />}
                  label="Đáp án C"
                />
                <FormControlLabel
                  value="D"
                  control={<Radio color="success" />}
                  label="Đáp án D"
                />
              </RadioGroup>
            </div>
          )}
        />
        <Controller
          name="explanation"
          control={control}
          render={({field}) => (
            <TextField
              {...field}
              placeholder="Nhập giải thích (nếu có)"
              label="Giải thích"
              fullWidth
              className="border border-[#919EAB52]"
              margin="normal"
            />
          )}
        />
        {/* <div className="mt-4 mb-4 w-full">
          <div className="font-medium mb-2">Hình ảnh câu hỏi (tùy chọn)</div>
          <input
            accept="image/*"
            className="hidden"
            id="upload-question-image"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="upload-question-image" className="w-full">
            <Card
              className="w-full max-w-md h-32 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400"
              sx={{
                backgroundColor: previewImage ? "transparent" : "#f7f7f7",
              }}
            >
              {isUploadingImage ? (
                <Box className="text-center">
                  <Typography className="text-gray-500 text-sm">
                    Đang tải ảnh...
                  </Typography>
                </Box>
              ) : previewImage && !isImageHidden ? (
                <CardMedia
                  component="img"
                  image={getImageUrl(previewImage)}
                  alt={selectedFile ? "Ảnh mới được chọn" : "Ảnh hiện tại"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.warn("Failed to load image:", previewImage);
                    target.src = DEFAULT_IMAGE_PLACEHOLDER;
                  }}
                />
              ) : (
                <Box className="text-center">
                  <Typography className="text-gray-500 mb-1 text-sm">
                    Kích thước: 400x240 pixel
                  </Typography>
                  <Typography className="text-gray-500 text-sm">
                    Tải ảnh lên (JPG, PNG, SVG, WEBP)
                  </Typography>
                </Box>
              )}
            </Card>
          </label>
          <Typography className="font-light" component="div">
            <div className="flex items-center gap-1 mb-2 mt-2">
              <InfoIcon fontSize="small" color="disabled" />
              <span className="break-words text-sm">
                <span className="text-[#212B36] font-semibold">
                  Kích thước:{" "}
                </span>{" "}
                400x240 pixel,{" "}
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
            {!selectedFile &&
              initialData?.image &&
              previewImage &&
              !isImageHidden && (
                <div className="flex items-center justify-between text-blue-600 text-sm mt-1">
                  <span>✓ Ảnh hiện tại từ hệ thống</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsImageHidden(true);
                    }}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    Ẩn ảnh
                  </button>
                </div>
              )}
            {isImageHidden && initialData?.image && (
              <div className="flex items-center justify-between text-gray-600 text-sm mt-1">
                <span>⚪ Ảnh đã được ẩn</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsImageHidden(false);
                    if (initialData?.image) {
                      setPreviewImage(initialData.image);
                    }
                  }}
                  className="text-blue-500 hover:text-blue-700 ml-2"
                >
                  Hiện lại
                </button>
              </div>
            )}
          </Typography>
        </div> */}
      </form>
    </Modal>
  );
}
