import { useState, useEffect } from "react";
import "./index.css";
import { RiDeleteBin6Line } from "react-icons/ri";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  const handleInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/todos");
      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data); // Log the entire response data

        if (Array.isArray(data)) {
          setTasks(data);
          console.log("Updated tasks:", data); // Log the updated tasks
        } else {
          console.log("No tasks in the response data.");
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      console.log("Adding task...");
      const response = await fetch("http://localhost:5010/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: taskInput }),
      });

      if (response.ok) {
        console.log("Task added successfully!");
        fetchTasks(); // Fetch tasks again after successful addition
        setTaskInput(""); // Clear the input field after adding a task
      } else {
        console.log("Failed to add task. Response:", response);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleTaskCompletion = async (id) => {
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5010/api/todos/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const remainingTasks = tasks.filter((task) => task.id !== id);
        setTasks(remainingTasks);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getFormattedDate = () => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    return new Date().toLocaleDateString(undefined, options);
  };

  const completedTasks = tasks.filter((task) => task.completed);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks && storedTasks.length > 0) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="main-con">
      <div className="todo-con">
        <div className="date-con">
          <div className="date">
            <div className="date-f">
              <h1 className="date-h1">{getFormattedDate()}</h1>
              <h1 className="date-h1">
                Active Tasks: {tasks.length - completedTasks.length}
              </h1>
            </div>
            <div className="tasks-done">
              <h1
                className={`date-h1 ${!showCompleted ? "active" : ""}`}
                onClick={() => setShowCompleted(false)}
              >
                Incomplete Tasks
              </h1>
              <h1
                className={`date-h1 ${showCompleted ? "active" : ""}`}
                onClick={() => setShowCompleted(true)}
              >
                Completed Tasks
              </h1>
            </div>
          </div>
        </div>
        <div className="input-con">
          <input
            type="text"
            placeholder="Enter the task"
            className="input-place"
            value={taskInput}
            onChange={handleInputChange}
          />
          <button type="button" onClick={handleAddTask} className="button-add">
            Add Task
          </button>
        </div>
        <ul className="todos-list">
          {tasks &&
            (showCompleted
              ? completedTasks.map((task) => (
                  <li key={task.id} className={`checked`}>
                    <span></span>
                    {task.text}
                    <span onClick={() => handleDeleteTask(task.id)}>
                      <RiDeleteBin6Line />
                    </span>
                  </li>
                ))
              : tasks
                  .filter((task) => !task.completed)
                  .map((task) => (
                    <li
                      key={task.id}
                      className={`${task.completed ? "checked" : ""}`}
                      onClick={() => handleTaskCompletion(task.id)}
                    >
                      <span></span>
                      {task.text}
                      <span onClick={() => handleDeleteTask(task.id)}>
                        <RiDeleteBin6Line />
                      </span>
                    </li>
                  )))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
