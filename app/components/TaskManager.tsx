'use client';

import { useState, useEffect } from 'react';

type Priority = 'alta' | 'media' | 'baja';

type Theme = 'light' | 'dark';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  startDate: string;
  category: string;
  priority: Priority;
  dueDate: string;
  tags: string[];
}

const PRIORITY_LABELS: Record<Priority, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
};

const formatDate = (value: string) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const normalizeTask = (task: any): Task => ({
  id: Number(task.id) || Date.now(),
  text: typeof task.text === 'string' ? task.text : '',
  completed: Boolean(task.completed),
  createdAt:
    typeof task.createdAt === 'string'
      ? task.createdAt
      : new Date().toISOString(),
  startDate:
    typeof task.startDate === 'string' && task.startDate
      ? task.startDate
      : '2026-02-07',
  category: typeof task.category === 'string' ? task.category : 'General',
  priority:
    task.priority === 'alta' || task.priority === 'media' || task.priority === 'baja'
      ? task.priority
      : 'media',
  dueDate: typeof task.dueDate === 'string' ? task.dueDate : '',
  tags: Array.isArray(task.tags)
    ? task.tags.filter((tag: unknown) => typeof tag === 'string')
    : [],
});

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('General');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('media');
  const [tagsInput, setTagsInput] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dueFilter, setDueFilter] = useState('all');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('media');
  const [editTags, setEditTags] = useState('');
  const [cloudSyncedAt, setCloudSyncedAt] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) =>
          normalizeTask(task)
        );
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    }

    const savedCloudSync = localStorage.getItem('tasksCloudSyncedAt');
    if (savedCloudSync) {
      setCloudSyncedAt(savedCloudSync);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem('theme', theme);
    }
  }, [theme, isLoaded]);

  const addTask = () => {
    if (input.trim() === '') {
      alert('Por favor, ingresa una tarea');
      return;
    }

    if (!startDate) {
      alert('Por favor, ingresa una fecha de inicio');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const newTask: Task = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      startDate,
      category: category.trim() || 'General',
      priority,
      dueDate,
      tags,
    };

    setTasks([newTask, ...tasks]);
    setInput('');
    setCategory('General');
    setStartDate('');
    setDueDate('');
    setPriority('media');
    setTagsInput('');
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

  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditText(task.text);
    setEditCategory(task.category);
    setEditStartDate(task.startDate);
    setEditDueDate(task.dueDate);
    setEditPriority(task.priority);
    setEditTags(task.tags.join(', '));
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditText('');
    setEditCategory('');
    setEditStartDate('');
    setEditDueDate('');
    setEditPriority('media');
    setEditTags('');
  };

  const saveEditTask = (id: number) => {
    if (editText.trim() === '') {
      alert('Por favor, ingresa una tarea');
      return;
    }

    const updatedTags = editTags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              text: editText.trim(),
              category: editCategory.trim() || 'General',
              startDate: editStartDate,
              dueDate: editDueDate,
              priority: editPriority,
              tags: updatedTags,
            }
          : task
      )
    );
    cancelEditTask();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleCloudSave = () => {
    localStorage.setItem('tasksCloud', JSON.stringify(tasks));
    const timestamp = new Date().toISOString();
    localStorage.setItem('tasksCloudSyncedAt', timestamp);
    setCloudSyncedAt(timestamp);
  };

  const handleCloudLoad = () => {
    const savedCloudTasks = localStorage.getItem('tasksCloud');
    if (!savedCloudTasks) {
      alert('No hay datos en la nube para sincronizar.');
      return;
    }

    try {
      const parsedTasks = JSON.parse(savedCloudTasks).map((task: any) =>
        normalizeTask(task)
      );
      setTasks(parsedTasks);
      const timestamp = new Date().toISOString();
      localStorage.setItem('tasksCloudSyncedAt', timestamp);
      setCloudSyncedAt(timestamp);
    } catch (error) {
      console.error('Error al sincronizar tareas:', error);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isOverdue = (task: Task) =>
    Boolean(task.dueDate) && new Date(task.dueDate) < today && !task.completed;

  const categories = Array.from(
    new Set(['General', ...tasks.map((task) => task.category).filter(Boolean)])
  );

  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      task.text.toLowerCase().includes(query) ||
      task.tags.some((tag) => tag.toLowerCase().includes(query));
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'completed'
        ? task.completed
        : !task.completed;
    const matchesCategory =
      categoryFilter === 'all' || task.category === categoryFilter;
    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesDue =
      dueFilter === 'all'
        ? true
        : dueFilter === 'with-date'
        ? Boolean(task.dueDate)
        : dueFilter === 'overdue'
        ? isOverdue(task)
        : !task.dueDate;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesPriority &&
      matchesDue
    );
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.filter((task) => !task.completed).length;
  const overdueCount = tasks.filter((task) => isOverdue(task)).length;

  return (
    <div className="container">
      <div className="header">
        <div className="header-row">
          <h1>📋 Gestor de Tareas</h1>
          <button
            className="theme-toggle"
            onClick={() =>
              setTheme((current) => (current === 'light' ? 'dark' : 'light'))
            }
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <p>Organiza tu día y mantén un seguimiento de tus tareas</p>
      </div>

      <div className="form">
        <div className="form-row">
          <input
            type="text"
            placeholder="Agrega una nueva tarea..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={addTask}>Agregar</button>
        </div>
        <div className="form-row form-row-meta">
          <input
            type="text"
            placeholder="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="alta">Prioridad alta</option>
            <option value="media">Prioridad media</option>
            <option value="baja">Prioridad baja</option>
          </select>
          <input
            type="text"
            placeholder="Etiquetas (separadas por coma)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Buscar por texto o etiqueta..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="pending">Pendientes</option>
          <option value="completed">Completadas</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categories.map((categoryOption) => (
            <option key={categoryOption} value={categoryOption}>
              {categoryOption}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">Todas las prioridades</option>
          <option value="alta">Prioridad alta</option>
          <option value="media">Prioridad media</option>
          <option value="baja">Prioridad baja</option>
        </select>
        <select value={dueFilter} onChange={(e) => setDueFilter(e.target.value)}>
          <option value="all">Todas las fechas</option>
          <option value="with-date">Con fecha</option>
          <option value="no-date">Sin fecha</option>
          <option value="overdue">Vencidas</option>
        </select>
      </div>

      <div className="cloud-sync">
        <div>
          <h3>☁️ Sincronización en la nube</h3>
          <p>
            Guarda una copia en la nube local o recupera tus tareas cuando lo
            necesites.
          </p>
        </div>
        <div className="cloud-actions">
          <button className="btn-secondary" onClick={handleCloudSave}>
            Guardar en la nube
          </button>
          <button className="btn-secondary" onClick={handleCloudLoad}>
            Sincronizar
          </button>
          <span className="cloud-meta">
            {cloudSyncedAt
              ? `Última sincronización: ${formatDate(cloudSyncedAt)}`
              : 'Aún no has sincronizado'}
          </span>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>✨ No hay tareas aún. ¡Crea una para comenzar!</p>
        </div>
      ) : (
        <div className="tasks-section">
          <h2>
            Mis Tareas ({filteredTasks.length} de {tasks.length})
          </h2>
          <ul className="task-list">
            {filteredTasks.map((task) => (
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
                {editingTaskId === task.id ? (
                  <div className="task-content">
                    <input
                      className="task-edit-input"
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="task-edit-meta">
                      <input
                        type="text"
                        placeholder="Categoría"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                      />
                      <input
                        type="date"
                        value={editStartDate}
                        onChange={(e) => setEditStartDate(e.target.value)}
                      />
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                      />
                      <select
                        value={editPriority}
                        onChange={(e) =>
                          setEditPriority(e.target.value as Priority)
                        }
                      >
                        <option value="alta">Prioridad alta</option>
                        <option value="media">Prioridad media</option>
                        <option value="baja">Prioridad baja</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Etiquetas"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="task-content">
                    <span className="task-text">{task.text}</span>
                    <div className="task-meta">
                      <span className="task-pill">{task.category}</span>
                      <span className={`task-pill priority-${task.priority}`}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                      {task.startDate && (
                        <span className="task-pill">
                          Inicio: {formatDate(task.startDate)}
                        </span>
                      )}
                      {task.dueDate && (
                        <span
                          className={`task-pill ${
                            isOverdue(task) ? 'overdue' : ''
                          }`}
                        >
                          Vence: {formatDate(task.dueDate)}
                        </span>
                      )}
                      {task.tags.map((tag) => (
                        <span key={tag} className="task-pill tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="task-actions">
                  {editingTaskId === task.id ? (
                    <>
                      <button
                        className="btn-edit"
                        onClick={() => saveEditTask(task.id)}
                      >
                        Guardar
                      </button>
                      <button className="btn-secondary" onClick={cancelEditTask}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-edit"
                        onClick={() => startEditTask(task)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => deleteTask(task.id)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
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
          <div className="stat-card">
            <h3>{overdueCount}</h3>
            <p>Vencidas</p>
          </div>
        </div>
      )}
    </div>
  );
}
