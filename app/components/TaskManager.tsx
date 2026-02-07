'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar tareas del localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar tareas en localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = () => {
    if (input.trim() === '') {
      alert('Por favor, ingresa una tarea');
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      text: input,
      completed: false,
      createdAt: new Date(),
    };

    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.filter((task) => !task.completed).length;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>📋 Gestor de Tareas</h1>
        <p>Organiza tu día y mantén un seguimiento de tus tareas</p>
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Agrega una nueva tarea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={addTask}>Agregar</button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>✨ No hay tareas aún. ¡Crea una para comenzar!</p>
        </div>
      ) : (
        <div className="tasks-section">
          <h2>Mis Tareas ({tasks.length})</h2>
          <ul className="task-list">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`task-item ${task.completed ? 'completed' : ''}`}
              >
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span className="task-text">{task.text}</span>
                <div className="task-actions">
                  <button
                    className="btn-delete"
                    onClick={() => deleteTask(task.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="stats">
          <div className="stat-card">
            <h3>{pendingCount}</h3>
            <p>Pendientes</p>
          </div>
          <div className="stat-card">
            <h3>{completedCount}</h3>
            <p>Completadas</p>
          </div>
        </div>
      )}
    </div>
  );
}
