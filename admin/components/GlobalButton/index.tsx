import "./index.scss";
import clsx from "clsx";
import {ButtonHTMLAttributes, DetailedHTMLProps, ReactNode} from "react";

interface GlobalButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: ReactNode;
  loading?: boolean;
}

function GlobalButton({
  children,
  loading = false,
  disabled,
  ...buttonProps
}: GlobalButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...buttonProps}
      disabled={isDisabled}
      className={clsx(
        "button-sso-wrapper",
        {
          loading,
          disabled: isDisabled,
        },
        buttonProps.className,
      )}
      type={buttonProps?.type || "button"}
    >
      <span className="button-content">
        {loading ? "Đang đăng nhập..." : children}
      </span>
      {loading && <span className="spinner" />}
    </button>
  );
}

export default GlobalButton;
