import React, { useState, useCallback, useEffect } from "react";
/** Components */
import {
  Card,
  Modal,
  Inputs,
  Form,
  CustomButton,
  RecursiveTree,
} from "../../components";
/** ServicesAPI */
import {
  SlackChannelsAPI,
  DriveAPI,
  UserApi,
  WorkspaceAPI,
} from "../../services";
/** Helper */
import { Storage, getToken } from "../../helper";
/** FontAwesome */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
/** React Router */
import { useNavigate, Navigate } from "react-router-dom";
/** Image */
import LoadingGIF from "../../assets/loading.gif";
/** class names */
import classnames from "classnames";
/** Swal */
import Swal from "sweetalert2";

interface Props {}

const Manage: React.FC<Props> = () => {
  const navigate = useNavigate();

  const [tabs, setTabs] = useState<{ [key: string]: any }[]>([
    {
      name: "Select a Folder",
      isActive: true,
    },
    {
      name: "Create New Folder",
      isActive: false,
    },
    {
      name: "Upload a Folder",
      isActive: false,
    },
  ]);

  const [channels, setChannels] = useState<any[]>([]);

  const [connectModal, setConnectModal] = useState<boolean>(false);

  const [currentChannel, setCurrentChannel] = useState<{ [key: string]: any }>(
    {}
  );

  const [loadingOpenModal, setLoadingOpenModal] = useState<boolean>(false);

  const [loadingConnectFolder, setLoadingConnectFolder] =
    useState<boolean>(false);

  const [errorConnectFolder, setErrorConnectFolder] = useState(false);

  const [loadingDisconnectFolder, setLoadingDisconnectFolder] =
    useState<boolean>(false);

  const [folders, setFolders] = useState<any[]>([]);

  const [selectValue, setSelectValue] = useState<{ [key: string]: any }>({});

  const [permission, setPermission] = useState<{ [key: string]: any }>({
    name: "write",
    isActive: false,
  });

  const [wantBookMark, setWantBookMark] = useState<boolean>(true);

  const [workspaces, setWorksSpaces] = useState<{ [key: string]: any }[]>([]);

  const [workspace, setWorkSpace] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (workspaces.length === 0) {
      workspacesAPI();
    }
  }, []);

  useEffect(() => {
    if (workspaces.length > 0) {
      channelsListAPI(workspace.id);
    }
  }, [workspace]);

  const workspacesAPI = async () => {
    try {
      const userId = Storage.get("data").id;

      const responseWorkspaces = await WorkspaceAPI.getAll(userId);

      setWorksSpaces(responseWorkspaces);

      setWorkSpace(responseWorkspaces[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const channelsListAPI = async (id: number) => {
    try {
      const result = await SlackChannelsAPI.getList(id);

      setChannels(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModal = async (name: string, id: string) => {
    setLoadingOpenModal(true);

    setConnectModal(true);

    try {
      const token = await getToken();

      const result: any = await DriveAPI.get({ token });

      setFolders(result);

      setCurrentChannel({
        channelName: name,
        channelId: id,
      });

      setLoadingOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabs = (index: number): void => {
    const newTabs = tabs.map((tab: { [key: string]: any }, tabidx: number) => {
      if (tabidx === index) {
        return {
          ...tab,
          isActive: true,
        };
      }
      return {
        ...tab,
        isActive: false,
      };
    });

    setTabs(newTabs);
  };

  const handleSelect = (selectFolder: { [key: string]: any }) => {
    setSelectValue({
      id: selectFolder.id,
      webViewLink: selectFolder.webViewLink,
      ownerEmail: selectFolder.owners.map((owner: { [key: string]: any }) => {
        return owner.emailAddress;
      }),
      name: selectFolder.name,
    });
  };

  const recursiveParentIds = (
    parentFolders: { [key: string]: any }[],
    parentList: string[],
    subFolders: { [key: string]: any }[],
    indexRec = 0
  ): any => {
    if (parentList.length === 0) {
      parentFolders = subFolders;
      return [parentFolders, true];
    }

    if (parentFolders.length > 0) {
      for (let i = 0; i < parentFolders.length; i++) {
        if (parentList[0] === parentFolders[i].id) {
          parentList.shift();
          const newIndexRec = indexRec + 1;
          const result = recursiveParentIds(
            parentFolders[i].folders,
            parentList,
            subFolders,
            newIndexRec
          );
          if (result && result[1]) {
            parentFolders[i].folders = result[0];

            return parentFolders[i].folders;
          }
        }
      }
    }
  };

  const fillFolders = (
    parentFolders: { [key: string]: any }[],
    subFolders: { [key: string]: any }[],
    parentList: string[]
  ): any => {
    const result = recursiveParentIds(parentFolders, parentList, subFolders, 0);

    setFolders([...parentFolders]);
  };

  const expandDriveFolder = async (folder: { [key: string]: any }) => {
    try {
      const token = await getToken();

      const subFolders: any = await DriveAPI.getSub(
        {
          folder_id: folder.id,
          token,
          parentFolder: !folder.parent
            ? [folder.id]
            : [...folder.parent, folder.id],
        },
        null
      );

      if (subFolders[0]) {
        folder.isActive = !folder.isActive;

        const parentList = [...subFolders[0].parent];

        const newFolders = [...folders];

        fillFolders(newFolders, subFolders, parentList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConnectDrive = async () => {
    try {
      if (Object.keys(selectValue).length) {
        setConnectModal(false);

        setLoadingConnectFolder(true);

        const bodyRequest: any = {
          ...selectValue,
          ...currentChannel,
          token: sessionStorage.getItem("accessToken"),
          permission: permission.isActive ? "writer" : "reader",
          bookmark: wantBookMark,
          access_token: workspace.access_token,
        };

        const queryParams: any = "select";

        const response = await DriveAPI.put(
          { query: queryParams },
          bodyRequest
        );

        const newChannels = channels.map((channel: { [key: string]: any }) => {
          if (channel.id === response.id) {
            return {
              ...channel,
              drive_name: response.drive_name,
              drive_link: response.drive_link,
            };
          }
          return {
            ...channel,
          };
        });

        setChannels(newChannels);

        setLoadingConnectFolder(false);

        setSelectValue({});

        setErrorConnectFolder(false);
      } else {
        throw "Select a folder first";
      }
    } catch (error: any) {
      if (error === "Select a folder first") {
        setErrorConnectFolder(true);
      } else if (
        error === "Drive folder already connected to another channel"
      ) {
        Swal.fire({
          icon: "error",
          title: "Connect folder failer",
          text: error,
        });
      }
      setLoadingConnectFolder(false);
      setConnectModal(true);
      console.log(error);
    }
  };

  const handleDisconnectDrive = async (name: string, id: number) => {
    try {
      setLoadingDisconnectFolder(true);

      const token = await getToken();

      const res = await DriveAPI.disconnect({
        name,
        id,
        token,
        access_token: workspace.access_token,
      });

      const newChannels = channels.map((channel: { [key: string]: any }) => {
        if (id === channel.id) {
          return {
            ...channel,
            drive_link: res.drive_link,
            drive_name: res.drive_name,
          };
        }
        return {
          ...channel,
        };
      });

      setChannels(newChannels);

      setLoadingDisconnectFolder(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWorkspaceChange = (e: any) => {
    const id = e.target.value;

    const filterWorkspace = workspaces.filter(
      (workspace: { [key: string]: any }) => {
        return id == workspace.id;
      }
    )[0];

    setWorkSpace(filterWorkspace);
  };

  const handleSignOut = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const renderConnectModal = () => (
    <Modal>
      <Card style="shadow-md shadow-gray-500 rounded-md bg-white max-w-screen-xl w-5/12">
        {loadingOpenModal ? (
          <div className="p-4 w-full flex flex-col justify-center items-center relative">
            <FontAwesomeIcon
              icon={faXmark}
              size="lg"
              className="cursor-pointer absolute top-4 right-4"
              onClick={() => {
                setSelectValue({});
                setConnectModal(false);
              }}
            ></FontAwesomeIcon>
            <img src={LoadingGIF} />
            <h1 className="mt-5 font-bold text-lg text-indigo-600">
              Fetching Drive Folder...
            </h1>
          </div>
        ) : (
          <div className="p-4">
            <div className="w-full flex flex-wrap justify-between items-center">
              <h1 className="font-bold text-lg text-gray-700">
                Connect A Folder
              </h1>
              <FontAwesomeIcon
                icon={faXmark}
                size="lg"
                className="cursor-pointer"
                onClick={() => {
                  setSelectValue({});
                  setConnectModal(false);
                  setErrorConnectFolder(false);
                }}
              ></FontAwesomeIcon>
            </div>
            <div className="mt-3">
              <p>
                Please choose a Google Drive folder to connect with the slack
                channel "
                <span className="font-bold">{currentChannel.channelName}</span>"
              </p>
            </div>
            <div className="mt-4">
              <RecursiveTree
                folders={folders}
                onSelectCallback={expandDriveFolder}
                selectValue={selectValue}
                handleSelect={handleSelect}
              />
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap w-full items-center mt-1">
                <input
                  id="bookmark"
                  name="bookmark"
                  type="checkbox"
                  checked={wantBookMark}
                  className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded cursor-pointer"
                  onChange={(e) => {
                    setWantBookMark(!wantBookMark);
                  }}
                />
                <span className="ml-4 text-base text-gray-500">
                  Add a link to this folder as a bookmark in the slack channel
                </span>
              </div>
              <div className="flex flex-wrap w-full items-center mt-4">
                <input
                  id="read"
                  name="read"
                  type="checkbox"
                  checked={true}
                  className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded cursor-pointer"
                  disabled
                />
                <span className="ml-4 text-base text-gray-500">
                  Give channel members read permissions to this folder
                </span>
              </div>
              <div className="flex flex-wrap w-full items-center mt-4">
                <input
                  id="write"
                  name="write"
                  type="checkbox"
                  checked={permission.isActive}
                  onChange={(e) =>
                    setPermission({
                      ...permission,
                      isActive: !permission.isActive,
                    })
                  }
                  className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded cursor-pointer"
                />
                <span className="ml-4 text-base text-gray-500">
                  Give channel members write permissions to this folder
                </span>
              </div>
            </div>
            {errorConnectFolder && (
              <div className="w-full bg-rose-500/[0.4] mt-4 py-2 px-4 border border border-rose-500 rounded">
                <span className="text-rose-600 font-bold">
                  Select a folder first
                </span>
              </div>
            )}
            <div className="flex flex-wrap w-full justify-end mt-7">
              <CustomButton
                style="py-2 px-6 bg-red-500	text-white font-bold rounded mr-4"
                action={() => {
                  setSelectValue({});
                  setConnectModal(false);
                  setErrorConnectFolder(false);
                }}
              >
                Cancel
              </CustomButton>
              <CustomButton
                style="py-2 px-6 bg-green-500	text-white font-bold rounded"
                action={() => handleConnectDrive()}
              >
                Connect
              </CustomButton>
            </div>
          </div>
        )}
      </Card>
    </Modal>
  );

  return (
    <div className="w-screen h-screen bg-gray-300 relative overflow-y-hidden">
      <button
        type="button"
        className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 font-bold	
        absolute bottom-4 left-4"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
      {connectModal && folders.length > 0 && renderConnectModal()}
      {loadingConnectFolder && (
        <Modal>
          <Card style="shadow-md shadow-gray-500 rounded-md bg-white max-w-screen-xl w-5/12">
            <div className="p-4 w-full flex flex-col justify-center items-center relative">
              <img src={LoadingGIF} />
              <h1 className="mt-5 font-bold text-lg text-indigo-600">
                Connecting folder to slack channel...
              </h1>
            </div>
          </Card>
        </Modal>
      )}
      {loadingDisconnectFolder && (
        <Modal>
          <Card style="shadow-md shadow-gray-500 rounded-md bg-white max-w-screen-xl w-5/12">
            <div className="p-4 w-full flex flex-col justify-center items-center relative">
              <img src={LoadingGIF} />
              <h1 className="mt-5 font-bold text-lg text-indigo-600">
                Disconnecting folder from a slack channel...
              </h1>
            </div>
          </Card>
        </Modal>
      )}
      <div className="w-full h-full flex flex-wrap justify-center items-center">
        <Card style="shadow-md shadow-gray-500 rounded-md bg-white max-w-screen-xl w-2/4 h-[650px]">
          <div className="p-5 h-full">
            <h1 className="mb-3 font-bold text-xl text-gray-700">
              Welcome to SlackDrive
            </h1>
            <h2 className="font-bold text-lg text-gray-700 my-5">
              Choose your workspace
            </h2>
            <select
              id="workspace"
              name="workspace"
              className="mb-5 block rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              onChange={handleWorkspaceChange}
            >
              {workspaces.length > 0 &&
                workspaces.map(
                  (
                    dataWorkspace: { [key: string]: any },
                    dataWorkspaceIdx: number
                  ) => (
                    <option
                      className="font-semibold"
                      value={dataWorkspace.id}
                      key={dataWorkspaceIdx}
                    >
                      {dataWorkspace.name}
                    </option>
                  )
                )}
            </select>
            <h1 className="font-bold text-lg text-gray-700">Manage Folder</h1>
            <p className="text-sm text-gray-700">
              Here you'll find a list of Slack Channels in your organization.
            </p>
            <table className="min-w-full divide-y divide-gray-300 mt-5">
              <thead className="bg-indigo-600">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                  >
                    Slack Channels
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                  >
                    Google Drive Folder
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {channels.length > 0 &&
                  channels.map(
                    (channel: { [key: string]: any }, channelIdx: number) => (
                      <tr
                        key={channelIdx}
                        className={
                          channelIdx % 2 === 0 ? undefined : "bg-gray-50"
                        }
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-grey-900 sm:pl-6">
                          {channel.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-grey-500">
                          {channel.drive_name ? channel.drive_name : "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-grey-500">
                          {channel.drive_name ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleDisconnectDrive(channel.name, channel.id)
                              }
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-400 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Disconnect Folder
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleModal(channel.name, channel.id)
                              }
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Connect Folder
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Manage;
