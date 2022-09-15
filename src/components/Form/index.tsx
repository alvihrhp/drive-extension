import React from "react";
/** Component */
import { Inputs } from "../index";
/** classnames */
import classnames from "classnames";

interface Props {
  inputs: { [key: string]: any }[];
  setInputs: React.Dispatch<React.SetStateAction<any>>;
  action?: () => void;
}

const Form: React.FC<Props> = ({ inputs, setInputs }) => {
  const handleForm = (name: string, value: any) => {
    const newInputs = inputs.map((input: { [key: string]: any }) => {
      if (name === input.name) {
        return {
          ...input,
          value,
        };
      }
      return {
        ...input,
      };
    });

    setInputs(newInputs);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <form id="form" className="w-full" onSubmit={handleSubmit}>
      {inputs.map((input: { [key: string]: any }, inputIdx: number) => (
        <div className="w-full" key={inputIdx}>
          <label
            htmlFor={input.name}
            className={classnames(`block text-sm font-medium text-gray-700`, {
              [`mb-2`]: inputIdx === 0,
              [`my-2`]: inputIdx > 0,
            })}
          >
            {input.label}
          </label>
          <Inputs
            id={input.id}
            name={input.name}
            inputType={input.inputType}
            value={input.value}
            placeholder={input.placeholder}
            type={input.type}
            action={handleForm}
            required={input.required}
          />
        </div>
      ))}
    </form>
  );
};

export default Form;
