import React, { useState } from "react";
/** FontAwesome */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
/** classnames */
import classnames from "classnames";

interface Props {
  id: string;
  onSelectCallback: (e: React.MouseEvent<HTMLInputElement>) => void;
  isSelected: boolean | undefined;
  children: ReadonlyArray<JSX.Element>;
  folder: { [key: string]: any };
  selectValue: { [key: string]: any };
  handleSelect: (folder: { [key: string]: any }) => void;
}

const TreeItem: React.FC<Props> = ({
  id,
  onSelectCallback,
  isSelected,
  children,
  folder,
  selectValue,
  handleSelect,
}) => {
  const [isOpen, toggleItemOpen] = useState<boolean | null>(null);
  const [selected, setSelected] = useState(isSelected);

  return (
    <div className="flex flex-col w-full mt-3">
      <div className="flex flex-wrap items-center space-between w-full">
        <div className="border py-1 px-2 shadow rounded relative">
          <input
            type="checkbox"
            id={folder.id}
            name={folder.name}
            className="absolute w-full h-full left-0 top-0 opacity-0 rounded z-10 cursor-pointer"
            onChange={(e: any) => {
              onSelectCallback(e);
            }}
          />
          <FontAwesomeIcon
            icon={folder.isActive ? faMinus : faPlus}
          ></FontAwesomeIcon>
        </div>
        <span className="ml-3">{folder.name}</span>
        <input
          id={folder.id}
          name="select-folder"
          type="radio"
          checked={selectValue.id === folder.id}
          className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 ml-auto"
          onChange={(e) => handleSelect(folder)}
        />
      </div>
      <div className="pl-3">{folder.isActive && children}</div>
    </div>
  );
};

export default TreeItem;
