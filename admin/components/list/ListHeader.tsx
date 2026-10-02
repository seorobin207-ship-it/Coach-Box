import {Box, Button} from "@mui/material";
import React from "react";

export interface ListHeaderAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "contained" | "outlined" | "text";
}

interface ListHeaderProps {
  title: string;
  description?: string;
  action?: ListHeaderAction;
}

export function ListHeader({
  title,
  description,
  action,
}: ListHeaderProps): JSX.Element {
  return (
    <Box className="mb-6 flex items-start justify-between gap-4">
      {/* ===== Left content ===== */}
      <Box>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </Box>

      {/* ===== Right action ===== */}
      {action && (
        <Box className="flex items-center gap-2">
          {React.isValidElement(action) ? (
            action
          ) : (
            <Button
              onClick={action.onClick}
              startIcon={action.icon}
              variant={action.variant ?? "contained"}
              className="
                !rounded-xl
                !px-5
                !py-2.5
                !font-semibold
                !normal-case
                !shadow-sm
                transition-all
              !bg-[#FF6315] hover:!bg-[#FF6315] !text-white
              "
            >
              {action.label}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
