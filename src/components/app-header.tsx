import React, { ReactNode } from "react";
import { Header as ZmpHeader } from "zmp-ui";
import { useLocation } from "react-router-dom";

export interface AppHeaderProps {
  title?: ReactNode;
  className?: string;
  showBackIcon?: boolean; // override
  noBack?: boolean; // force hide
  variant?: "primary" | "neutral"; // visual style, default primary
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  className,
  showBackIcon,
  noBack,
  variant = "primary",
}) => {
  const location = useLocation();
  const autoShowBack = location.key !== "default";
  const shouldShowBack = showBackIcon ?? (!noBack && autoShowBack);
  const variantClass =
    variant === "primary" ? "bg-primary text-primaryForeground" : "";

  return (
    <ZmpHeader
      className={[
        "app-header no-border flex-none px-4 pb-[6px]",
        variantClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      title={title as any}
      showBackIcon={shouldShowBack}
    />
  );
};

export default AppHeader;
