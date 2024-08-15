import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Select, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

interface Todo {
  id: number;
  firstName: string;
  lastName: string;
  level: string;
}

interface Level {
  value: string;
  label: string;
}

const TodoUp: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [newTodo, setNewTodo] = useState<{
    id?: number;
    firstName: string;
    lastName: string;
    level: string;
  }>({
    firstName: "",
    lastName: "",
    level: "",
  });

  const showModal = (todo?: Todo) => {
    if (todo) {
      setNewTodo({
        id: todo.id,
        firstName: todo.firstName,
        lastName: todo.lastName,
        level: todo.level,
      });
      setIsEditing(true);
    } else {
      setNewTodo({
        firstName: "",
        lastName: "",
        level: "",
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (isEditing) {
      axios
        .put(`http://localhost:3000/TodoUp/${newTodo.id}`, newTodo)
        .then((response) => {
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo.id === response.data.id ? response.data : todo
            )
          );
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.error("Error updating todo:", error);
        });
    } else {
      axios
        .post("http://localhost:3000/TodoUp", newTodo)
        .then((response) => {
          setTodos((prevTodos) => [...prevTodos, response.data]);
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.error("Error adding todo:", error);
        });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTodo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setNewTodo((prevState) => ({
      ...prevState,
      level: value,
    }));
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`http://localhost:3000/TodoUp/${id}`)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/TodoUp")
      .then((response) => {
        setTodos(response.data);
        setLevels([
          { value: "Junior", label: "Junior" },
          { value: "Middle", label: "Middle" },
          { value: "Senior", label: "Senior" },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="p-6">
      <div className="container mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Title level={1} className="text-blue-600">
              TODO UP
            </Title>
            <Button type="primary" onClick={() => showModal()}>
              Open Add
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="w-full bg-gray-200 border-b">
                  <th className="py-2 px-4 text-left">First Name</th>
                  <th className="py-2 px-4 text-left">Last Name</th>
                  <th className="py-2 px-4 text-left">Level</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todos.length > 0 ? (
                  todos.map((todo) => (
                    <tr key={todo.id} className="border-b">
                      <td className="py-2 px-4">{todo.firstName}</td>
                      <td className="py-2 px-4">{todo.lastName}</td>
                      <td className="py-2 px-4">{todo.level}</td>
                      <td className="py-2 px-4">
                        <button
                          className="text-blue-500 hover:underline mr-2"
                          onClick={() => showModal(todo)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleDelete(todo.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-2 px-4 text-center">
                      No todos available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal
        title={isEditing ? "Edit Todo" : "Add Todo"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>First Name</p>
        <Input
          size="large"
          placeholder="First Name"
          prefix={<UserOutlined />}
          name="firstName"
          value={newTodo.firstName}
          onChange={handleInputChange}
          className="mb-2"
        />
        <p>Last Name</p>
        <Input
          size="large"
          placeholder="Last Name"
          prefix={<UserOutlined />}
          name="lastName"
          value={newTodo.lastName}
          onChange={handleInputChange}
          className="mb-2"
        />
        <p>Level</p>
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Select a level"
          optionFilterProp="children"
          onChange={handleSelectChange}
          value={newTodo.level || undefined}
        >
          {levels.map((level) => (
            <Option key={level.value} value={level.value}>
              {level.label}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default TodoUp;
