
import React, { JSX } from "react";
import { Button } from "react-bootstrap";
import { FaArrowLeftLong } from "react-icons/fa6";
import { HiEye } from "react-icons/hi";
// import { PermissionWrapper } from "@/app/wrapper/permissionWrapper";

type CustomButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  name?: string;
  type?: string;
  icon?: JSX.Element;
  disabled?: boolean;
  isLoader?: boolean;
  onClick? :() => void;
  className?: string;
  showInitially?: boolean;
  prifix?: boolean;
  permission_name?: string;
  style?: React.CSSProperties;
};

export default function CustomButton({
  name,
  type,
  icon,
  disabled,
  isLoader = false,
  onClick,
  className,
  permission_name,
  prifix = false,
  showInitially = false,
  style,
  ...props
}: CustomButtonProps) {
 
  return (

    permission_name == null ?   <Button
    key={`btn-${name}`}
    className={
      !isLoader
        ? `${className} color button d-flex align-items-center`
        : `${className} btn d-flex align-items-center loading`
    }
    type={type}
    onClick={onClick}
    disabled={disabled}
    style={style}
  >
    {isLoader && <div key={`loading-${name}`} className="spinner"></div>}
    {!prifix  && icon}

    { name && (
      <span key={`span-loading-${name}`} className="ms-1">
        {isLoader ? "Loading" : name}
      </span>
    )}
     {prifix && !isLoader && icon}
  </Button>:
    // <PermissionWrapper
    //   permission_name={permission_name}
    //   showInitially={showInitially}
    // >
      <Button
        key={`btn-${name}`}
        className={
          !isLoader
            ? `${className} color button d-flex align-items-center`
            : `${className} btn d-flex align-items-center loading`
        }
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={style}
      >
        {isLoader && <div key={`loading-${name}`} className="spinner"></div>}
        {!prifix  && icon}

        { name && (
          <span key={`span-loading-${name}`} className="ms-1">
            {isLoader ? "Loading" : name}
          </span>
        )}
         {prifix && !isLoader && icon}
      </Button>
    //  </PermissionWrapper>
  );
}
