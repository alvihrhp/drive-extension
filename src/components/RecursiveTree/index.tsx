import React, { Fragment, useState } from "react";
/** Components */
import { TreeItem } from "../index";

interface Props {
  folders: { [key: string]: any }[];
  onSelectCallback: (folder: { [key: string]: any }) => void;
  selectValue: { [key: string]: any };
  handleSelect: (folder: { [key: string]: any }) => void;
}

const RecursiveTree: React.FC<Props> = ({
  folders,
  onSelectCallback,
  selectValue,
  handleSelect,
}) => {
  const createTree = (folder: { [key: string]: any }): any => {
    return (
      <TreeItem
        id={folder.id}
        key={folder.id}
        onSelectCallback={(e: React.MouseEvent<HTMLElement>) => {
          onSelectCallback(folder);
        }}
        isSelected={folder.isActive}
        folder={folder}
        selectValue={selectValue}
        handleSelect={handleSelect}
      >
        {folder.folders.map((folder: { [key: string]: any }) => (
          <Fragment key={folder.id}>{createTree(folder)}</Fragment>
        ))}
      </TreeItem>
    );
  };

  return (
    <>
      {folders.map((folder: { [key: string]: any }, folderIdx: number) => (
        <div key={folderIdx}>{createTree(folder)}</div>
      ))}
    </>
  );
};

export default RecursiveTree;
