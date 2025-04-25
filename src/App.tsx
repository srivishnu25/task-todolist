import { useEffect, useRef, useState } from "react";

import { FormSubmitHandler, ListItem } from "./types";
import { getItem, setItem } from "./utils";
import { IconDelete, IconEdit } from "./assets/icons";
import Modal from "./Modal";

function App() {
  const [list, setList] = useState<ListItem[]>(
    getItem<ListItem[]>("list") || []
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const [editItem, setEditItem] = useState<ListItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSubmit: FormSubmitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString().trim();
    if (name) {
      setList((prev) => [
        { id: Date.now().toString(), name, isDone: false },
        ...prev,
      ]);
      if (inputRef.current) inputRef.current.value = "";
      formData.set("name", "");
    }
  };

  const handleStatus = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: ListItem["id"]
  ): void => {
    setList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, isDone: e.target.checked } : item
      )
    );
    requestAnimationFrame(() => {
      setList((prevList) =>
        [...prevList].sort((a, b) => Number(a.isDone) - Number(b.isDone))
      );
    });
  };

  const handleDelete = (id: ListItem["id"]) => {
    setList((prevList) => prevList.filter((l) => l.id !== id));
  };

  const handleEditClick = (item: ListItem) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedName = formData.get("editName")?.toString().trim();
    if (editItem && updatedName) {
      setList((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, name: updatedName } : item
        )
      );
      setIsModalOpen(false);
      setEditItem(null);
    }
  };

  useEffect(() => {
    setItem("list", list);
  }, [list]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsModalOpen(false);
        setEditItem(null);
      }
    };
    if (isModalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  return (
    <div className="flex flex-col items-center space-y-10 py-10 w-full">
      <h1>Todo List</h1>
      <div>
        <form onSubmit={handleSubmit} autoComplete="off" className="space-x-4">
          <input
            ref={inputRef}
            autoFocus
            name="name"
            maxLength={20}
            placeholder="Enter task name"
            className="h-10 border border-gray-100 rounded-md px-3 py-1"
          />
          <button className="bg-[#1a1a1a] px-3 py-2" type="submit">
            Add Task
          </button>
        </form>
      </div>
      {list.length > 0 ? (
        <table className="w-1/2 border border-gray-700 text-white">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-gray-700 p-2 w-10"></th>
              <th className="border border-gray-700 p-2 text-left">Task</th>
              <th className="border border-gray-700 p-2 text-center">Edit</th>
              <th className="border border-gray-700 p-2 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-gray-900">
                <td className="border border-gray-700 p-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.isDone}
                    onChange={(e) => handleStatus(e, item.id)}
                  />
                </td>
                <td className="border border-gray-700 p-2">{item.name}</td>
                <td className="border border-gray-700 p-2 text-center">
                  <button
                    className="p-1 rounded"
                    onClick={() => handleEditClick(item)}
                  >
                    <IconEdit />
                  </button>
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  <button
                    className="p-1 bg-red-500 hover:bg-red-600 rounded"
                    onClick={() => handleDelete(item.id)}
                  >
                    <IconDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <></>
      )}
      {isModalOpen && (
        <Modal
          onClose={() => {
            setIsModalOpen(false);
            setEditItem(null);
          }}
        >
          <h2 className="text-black mb-4">Edit Task</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              maxLength={20}
              autoFocus
              name="editName"
              defaultValue={editItem?.name}
              className="border px-2 py-1 w-full text-black"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded w-full"
            >
              Update Task
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default App;
