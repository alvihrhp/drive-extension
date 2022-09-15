import React, { ReactNode } from "react";

interface Props {
  key?: any;
  inputType: string;
  children?: any;
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: any;
  action?: (name: string, value: any) => void;
  required?: boolean;
}

const Inputs: React.FC<Props> = ({
  inputType,
  children,
  id,
  name,
  type,
  placeholder,
  value,
  action,
  required,
}) => {
  const renderDefault = () => (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
      value={value}
      onChange={(e) => action && action(e.target.name, e.target.value)}
      required={!required ? false : true}
    />
  );

  const renderTextArea = () => (
    <textarea
      id={id}
      name={name}
      rows={3}
      className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
      defaultValue={value}
      placeholder={placeholder}
      onChange={(e) => action && action(e.target.name, e.target.value)}
      required={!required ? false : true}
    />
  );

  const renderSelect = () => children;

  return inputType === "select" ? (
    renderSelect()
  ) : inputType === "default" ? (
    renderDefault()
  ) : inputType === "text_area" ? (
    renderTextArea()
  ) : (
    <></>
  );
};

export default Inputs;
