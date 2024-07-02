import React, { useEffect, useState } from "react";
import ToDoForm from "./ToDoForm";

const ToDoWrapper = () => {
    const [todos, setTodos] = useState([]);

    const createUser = async () => {
        try {
            await fetch('https://playground.4geeks.com/todo/users/maikel_cardenas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([])
            });
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch('https://playground.4geeks.com/todo/users/maikel_cardenas');
            if (response.status === 404) {
                await createUser();
                // Re-fetch data after user creation
                const retryResponse = await fetch('https://playground.4geeks.com/todo/users/maikel_cardenas');
                const data = await retryResponse.json();
                setTodos(data.todos);
            } else {
                const data = await response.json();
                setTodos(data.todos);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addTodo = async (todo) => {
        try {
            const response = await fetch('https://playground.4geeks.com/todo/todos/maikel_cardenas', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "label": todo,
                    "is_done": false
                })
            });
            const newTodo = await response.json();
            setTodos(prevState => [...prevState, newTodo]);
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
                method: 'DELETE'
            });
            if (response.status === 204) {
                fetchData();
            }
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    return (
        <div className="list">
            <h1 className="header">To Do List</h1>
            <div className="principalContainer">
                <ToDoForm addTodo={addTodo} />
                <div className="todo-list">
                    {todos.length === 0 ? (<p>There's no task, add some tasks.</p>) : (
                        todos.map((todo, index) => (
                            <div key={index} className="todo-item">
                                <span>{todo.label}</span>
                                <div className="btn-container">
                                    <button onClick={() => deleteTodo(todo.id)} className="btn btn-danger btn-sm">
                                        <i className="fa fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div style={{ color: "white" }}>
                    {todos.length} task{todos.length !== 1 && 's'}
                </div>
            </div>
        </div>
    );
};

export default ToDoWrapper;
