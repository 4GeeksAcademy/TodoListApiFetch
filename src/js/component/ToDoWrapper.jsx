import React, { useEffect, useState } from "react";
import ToDoForm from "./ToDoForm";

const ToDoWrapper = () => {
    const [todos, setTodos] = useState([]);

    const checkAndCreateUser = async () => {
        try {
            const response = await fetch('https://playground.4geeks.com/todo/users/maikel_cardenas');
            if (response.status === 404) {
                await fetch('https://playground.4geeks.com/todo/users/maikel_cardenas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([])
                });
            }
        } catch (error) {
            console.error("Error checking or creating user:", error);
        }
    };

    async function fetchData() {
        try {
            await checkAndCreateUser();
            const response = await fetch('https://playground.4geeks.com/todo/users/maikel_cardenas');
            const data = await response.json();
            console.log(data);
            setTodos(prevState => prevState = data.todos);
        } catch (error) {
            console.log(error);
        }
    }

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
            setTodos(prevState => [...prevState, newTodo] );
        } catch (error) {
            console.error(error);
        }
    }

    const deleteTodo = async (id) => {
        console.log(`Attempting to delete todo with ID: ${id}`);
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
                method: 'DELETE'
            });
            if (response.status === 204 ) {
                console.log("Todo deleted successfully:", id);
                fetchData();
            }
        } catch (error) {
            console.error("Error deleting todo:", id, error);
        }
    };

    return (
        <div className="list">
            <h1 className="header">To Do List</h1>
            <div className="principalContainer">
                <ToDoForm addTodo={addTodo} />
                <div className="todo-list">
                    {todos.length === 0 ? (<p>There's no task, add some tasks.</p>) : (
                    todos.map( (todo, index)=> (
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
                <div style={{color: "white"}}>
                    { todos.length } task
                </div>
            </div>
        </div>
    );
};

export default ToDoWrapper;
