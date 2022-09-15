import React, { ReactNode } from "react";
/** classnames */
import classnames from "classnames";

interface Props {
  children: ReactNode;
}

const Modal: React.FC<Props> = ({ children }) => {
  return (
    <div
      className="
    absolute
    w-full 
    h-full 
    flex 
    flex-wrap 
    justify-center 
    items-center 
    z-10
    bg-slate-900/50
    rounded-md
    shadow"
    >
      {children}
    </div>
  );
};

export default Modal;
