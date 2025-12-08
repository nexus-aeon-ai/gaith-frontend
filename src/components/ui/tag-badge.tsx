import React from "react";

import { Badge } from "@/components/ui/badge";
import { TAG_BADGE_LIGHT_COLOR } from "@/lib/utils";
import { isLightColor } from "@/lib/utils/functions/is-light-color";

interface TagBadgeProps {
  label: string;
  color: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ label, color, className, style, children }) => {
  const isLight = isLightColor(color);
  const badgeBg = color ? `${color}20` : undefined;
  const badgeText = isLight ? TAG_BADGE_LIGHT_COLOR : color;
  const badgeBorder = isLight ? TAG_BADGE_LIGHT_COLOR : color;

  return (
    <Badge
      className={className}
      style={{
        backgroundColor: badgeBg,
        color: badgeText,
        borderColor: badgeBorder,
        borderWidth: 1,
        ...style,
      }}
    >
      {children}
      {label}
    </Badge>
  );
};
