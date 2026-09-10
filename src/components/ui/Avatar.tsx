import React from "react";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = "md", className = "" }) => {
  const sizeStyles = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
    xl: "w-14 h-14 text-lg",
  };

  const getInitials = (n: string) => {
    if (!n) return "U";
    const parts = n.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full font-semibold overflow-hidden border border-white shadow-sm ring-1 ring-black/5 select-none ${sizeStyles[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#635BFF] to-[#4F46E5] text-white flex items-center justify-center">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export const AvatarGroup: React.FC<{ users: { name: string; src?: string | null }[]; max?: number }> = ({
  users,
  max = 4,
}) => {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((u, i) => (
        <Avatar key={i} name={u.name} src={u.src} size="sm" className="ring-2 ring-white" />
      ))}
      {remaining > 0 && (
        <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold flex items-center justify-center border border-gray-200 ring-2 ring-white">
          +{remaining}
        </div>
      )}
    </div>
  );
};
