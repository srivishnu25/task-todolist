import { useEffect, useRef, useState } from "react";
import "./App.css";
import { FormSubmitHandler, ListItem } from "./types";
import { getItem, setItem } from "./utils";
import { IconDelete, IconEdit } from "./assets/icons";

function App() {
  const [list, setList] = useState<ListItem[]>(
    getItem<ListItem[]>("list") || []
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit: FormSubmitHandler = (e) => {
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

  useEffect(() => {
    setItem("list", list);
  }, [list]);
  return (
    <>
      <h1>Todo List</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            autoFocus
            autoComplete="off"
            name="name"
            placeholder="Enter task name"
          />
          <button type="submit">Add Task</button>
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
                  <button className="p-1 rounded">
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
    </>
  );
}

export default App;
