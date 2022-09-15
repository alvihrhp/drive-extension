import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  style: string;
}

const Card: React.FC<Props> = ({ children, style }) => {
  return (
    <div className={style} style={{ overflowY: "scroll" }}>
      {children}
    </div>
  );
};

export default Card;
