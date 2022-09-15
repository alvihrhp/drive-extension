import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  style: string;
  action: Function;
}

const CustomButton: React.FC<Props> = ({ children, style, action }) => {
  return (
    <button type="button" className={style} onClick={() => action()}>
      {children}
    </button>
  );
};

export default CustomButton;
