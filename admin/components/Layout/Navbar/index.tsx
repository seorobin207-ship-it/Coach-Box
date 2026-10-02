import {UserOutlined} from "@ant-design/icons";
import {logoutUser} from "@slices/UserSlice";
import {Avatar} from "antd";
import {useRouter} from "next/router";
import React, {useState} from "react";
import {useDispatch} from "react-redux";

interface ConfirmLogoutModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmLogoutModal({onCancel, onConfirm}: ConfirmLogoutModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Đóng hộp thoại"
        onClick={onCancel}
        className="absolute inset-0 bg-black/40 cursor-default"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 w-[360px] shadow-xl animate-scale-in">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Đăng xuất khỏi hệ thống?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng CoachBox Admin.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Navbar(): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between relative">
      {/* Left */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">CoachBox Admin</h1>
        <p className="text-xs text-gray-500">
          Hệ thống quản lý nội dung học tập môi trường
        </p>
      </div>

      {/* Right: User Menu */}
      <div className="relative">
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Avatar
            size={36}
            icon={<UserOutlined />}
            style={{backgroundColor: "#36BF9F"}}
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-medium text-gray-900">Admin</span>
            <span className="text-xs text-gray-500">Quản trị hệ thống</span>
          </div>
        </button>

        {/* Dropdown */}
        {openMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Quản trị hệ thống</p>
            </div>

            <div className="border-t border-gray-100" />

            <button
              onClick={() => {
                setOpenMenu(false);
                setOpenConfirm(true);
              }}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
            >
              🚪 Đăng xuất
            </button>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {openConfirm && (
        <ConfirmLogoutModal
          onCancel={() => setOpenConfirm(false)}
          onConfirm={handleLogout}
        />
      )}
    </header>
  );
}
