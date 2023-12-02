import { FC } from "react";
import SPWidgetTitle from "../subpagewidgettitle";
import { useNavigate, Routes, Route } from "react-router-dom";
import homeImage from "../../../assets/ToDoList.png";
import todayImage from "../../../assets/CalendarIcon.png";
import upcomingImage from "../../../assets/UpcomingIcon.png";
import starredImage from "../../../assets/StarredIcon.png";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./todolist.scss";
import plusIcon from "../../../assets/plussymbol.svg";

import Cookies from "js-cookie";
import { todo } from "node:test";
interface SideBarProp {
  imgsrc: string;
  sbtext: string;
  onClick: () => void;
  active: boolean;
}

interface Todo {
  id: number;
  text: string;
}

const ToDoOverlay: FC<{
  onTaskCreate: (taskinfo: object) => void;
  onClose: () => void;
}> = ({ onTaskCreate, onClose }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleCreateTask = () => {
    const formatDueDate = (dueDateString: string): string => {
      if (dueDateString == "") {
        return;
      }
      const dueDate = new Date(dueDateString);
      const now = new Date();

      const options: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
        year:
          now.getFullYear() !== dueDate.getFullYear() ? "numeric" : undefined,
      };

      return new Intl.DateTimeFormat("en-US", options).format(dueDate);
    };
    const taskInfo = {
      id: new Date().getTime(),
      text: taskName,
      description: taskDescription,
      dueDate: formatDueDate(dueDate),
    };
    console.log(taskInfo);
    onTaskCreate(taskInfo);
    onClose();
  };

  return (
    <div className="toDoOverlayContainer">
      <div className="todoOverlay">
        <ul className="inputBoxes">
          <li className="taskName">
            {" "}
            <input
              className="taskNameInput"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />{" "}
          </li>
          <li className="taskDescription">
            {" "}
            <input
              className="taskDescriptionInput"
              placeholder="Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </li>
          <div className="bottomBar">
            <li className="dueDate">
              {" "}
              <label htmlFor="dueDateforTask"> Due Date </label>
              <input
                type="date"
                className="dueDateforTask"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />{" "}
            </li>
          </div>
          <div className="todoOptions">
            <li className="closeToDo">
              <button className="closeButton" onClick={onClose}>
                Close
              </button>
            </li>
            <li className="create">
              <button className="createButton" onClick={handleCreateTask}>
                Create
              </button>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

const ToDoSideBarTitle: FC = (props) => {
  return <h1 className="todosidebarheader"> To-Do </h1>;
};

const ToDoSideBar: FC<SideBarProp> = (props) => {
  return (
    <>
      <li
        className={"todosidebaritems" + (props.active ? " active" : "")}
        onClick={props.onClick}
      >
        {" "}
        <img
          className="sidebarimg"
          src={props.imgsrc}
          alt="Hello Alt Text"
        />{" "}
        <p className={"sidebartext"}> {props.sbtext} </p>{" "}
      </li>
    </>
  );
};

const ToDoWidgetPage: FC = () => {
  function isToday(formattedDateString) {
    const today = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
    }).format(new Date());
  
    return formattedDateString === today;
  }
  
  const navigate = useNavigate();
  const { page } = useParams();
  const [creatingEvent, setCreatingEvent] = useState(false);
  const widgettitle = page || "Default Widget Title";
  let twidgetimage: string;
  let WidgetSubPage: JSX.Element | null = null;
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleTaskCreate = (taskinfo: object) => {
    // Adding the task to the state
    setTodos((prevTodos) => [...prevTodos, taskinfo]);

    // Read existing tasks from the "todos" cookie
    const existingTasks = Cookies.get("todos");
    const existingTasksArray = existingTasks ? JSON.parse(existingTasks) : [];

    // Append the new task to the existing array and update the "todos" cookie
    const updatedTasks = [...existingTasksArray, taskinfo];
    console.log(updatedTasks);
    Cookies.set("todos", JSON.stringify(updatedTasks));
  };

  useEffect(() => {
    (async () => {
      const storedTodos = Cookies.get("todos");
      try {
        if (storedTodos) {
          const parsedTodos = JSON.parse(storedTodos);
          console.log(parsedTodos);
          await setTodos(parsedTodos || "Cannot Find");
        }
      } catch (error) {
        console.log(storedTodos);
        console.error(error);
      }
    })();
  }, []);

  // ... (your existing code)

  switch (widgettitle) {
    
    case "Home":
      twidgetimage = homeImage;

      WidgetSubPage = (
        <>
          {creatingEvent ? (
            <ToDoOverlay
              onTaskCreate={handleTaskCreate}
              onClose={() => setCreatingEvent(false)}
            />
          ) : (
            ""
          )}
          <div className="toDoElementContainers">
            <div className="ToDoItems">
              <ul>
                {todos.map((todo) => (
                  <li className="toDoInfo" key={todo.id}>
                    <p className="toDoTitle"> {todo.text} </p>
                    {todo.description ? (
                      <p className="todoDescription"> {todo.description} </p>
                    ) : null}
                    {todo.dueDate ? (
                      <p className="todoDueDate"> {todo.dueDate} </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
            <div className="createToDoButtonContainer">
              <img
                className="newtaskImage"
                alt="newtaskImage"
                src={plusIcon}
                onClick={() => setCreatingEvent(true)}
              />
              <button
                className="createToDoButton"
                onClick={() => setCreatingEvent(true)}
              >
                {" "}
                Add Task{" "}
              </button>
            </div>
          </div>
        </>
      );
      break;
    case "Today":
      twidgetimage = todayImage;

      WidgetSubPage = (
        <>
          {creatingEvent ? (
            <ToDoOverlay
              onTaskCreate={handleTaskCreate}
              onClose={() => setCreatingEvent(false)}
            />
          ) : (
            ""
          )}
          <div className="toDoElementContainers">
            <div className="ToDoItems">
              <ul>
                {todos.map((todo) =>
                  isToday(todo.dueDate) == true ? (
                    <li className="toDoInfo" key={todo.id}>
                      <p className="toDoTitle">{todo.text}</p>
                      {todo.description ? (
                        <p className="todoDescription">{todo.description}</p>
                      ) : null}
                      {todo.dueDate ? (
                        <p className="todoDueDate">{todo.dueDate}</p>
                      ) : null}
                    </li>
                  ) : null
                )}
              </ul>
            </div>
            <div className="createToDoButtonContainer">
              <img
                className="newtaskImage"
                alt="newtaskImage"
                src={plusIcon}
                onClick={() => setCreatingEvent(true)}
              />
              <button
                className="createToDoButton"
                onClick={() => setCreatingEvent(true)}
              >
                {" "}
                Add Task{" "}
              </button>
            </div>
          </div>
        </>
      );
      break;
      case "Upcoming":
  twidgetimage = upcomingImage;

  // Filter tasks with due dates greater than today
  function isUpcoming(formattedDateString) {
    const today = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
    }).format(new Date());
  
    return formattedDateString > today;
  }

  WidgetSubPage = (
    <>
      {creatingEvent ? (
        <ToDoOverlay
          onTaskCreate={handleTaskCreate}
          onClose={() => setCreatingEvent(false)}
        />
      ) : (
        ""
      )}
      <div className="toDoElementContainers">
        <div className="ToDoItems">
          <ul>
          {todos.map((todo) =>
                  isUpcoming(todo.dueDate) == true ? (
                    <li className="toDoInfo" key={todo.id}>
                      <p className="toDoTitle">{todo.text}</p>
                      {todo.description ? (
                        <p className="todoDescription">{todo.description}</p>
                      ) : null}
                      {todo.dueDate ? (
                        <p className="todoDueDate">{todo.dueDate}</p>
                      ) : null}
                    </li>
                  ) : null
                )}
          </ul>
        </div>
        <div className="createToDoButtonContainer">
          <img
            className="newtaskImage"
            alt="newtaskImage"
            src={plusIcon}
            onClick={() => setCreatingEvent(true)}
          />
          <button
            className="createToDoButton"
            onClick={() => setCreatingEvent(true)}
          >
            {" "}
            Add Task{" "}
          </button>
        </div>
      </div>
    </>
  );
  break;
    case "Starred":
      twidgetimage = starredImage;
      WidgetSubPage = <h1> Hello From the Settings Page</h1>;
      break;
    default:
      twidgetimage = homeImage;
  }

  return (
    <>
      <div className="todowidgettitle">
        <SPWidgetTitle widgettitle={widgettitle} imageSource={twidgetimage} />
      </div>
      <div className="todowidgetcontainer">
        <div className="todosidebar">
          <ToDoSideBarTitle />
          <ul>
            <ToDoSideBar
              sbtext="Home"
              imgsrc={homeImage}
              onClick={() => navigate("/todo/Home")}
              active={widgettitle === "Home"}
            />
            <ToDoSideBar
              sbtext="Today"
              imgsrc={todayImage}
              onClick={() => navigate("/todo/Today")}
              active={widgettitle === "Today"}
            />
            <ToDoSideBar
              sbtext="Upcoming"
              imgsrc={upcomingImage}
              onClick={() => navigate("/todo/Upcoming")}
              active={widgettitle === "Upcoming"} // Set active based on the current widget
            />
            <ToDoSideBar
              sbtext="Starred"
              imgsrc={starredImage}
              onClick={() => navigate("/todo/Starred")}
              active={widgettitle === "Starred"} // Set active based on the current widget
            />
          </ul>
        </div>
        <div className="subpagewidget">{WidgetSubPage}</div>
      </div>
    </>
  );
};

export default ToDoWidgetPage;
