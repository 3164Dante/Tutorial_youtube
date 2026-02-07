# 📋 Gestor de Tareas - Next.js

Una aplicación web moderna para gestionar tareas diarias construida con Next.js y React.

## ✨ Características

- ✅ **Agregar tareas** - Crea nuevas tareas de forma rápida
- ✅ **Editar tareas** - Actualiza el texto, etiquetas, prioridad o fecha cuando lo necesites
- ✅ **Categorías y etiquetas** - Organiza tus tareas con categorías y tags
- ✅ **Fecha de vencimiento** - Define fechas límite y detecta tareas vencidas
- ✅ **Prioridades** - Clasifica tareas por nivel de urgencia
- ✅ **Búsqueda y filtrado** - Encuentra tareas por texto, etiqueta, estado o categoría
- ✅ **Marcar como completadas** - Marca tareas como terminadas con un checkbox
- ✅ **Eliminar tareas** - Borra tareas que ya no necesites
- ✅ **Persistencia de datos** - Las tareas se guardan en el navegador (localStorage)
- ✅ **Sincronización en la nube** - Guarda y recupera un respaldo local en la nube simulada
- ✅ **Estadísticas** - Ve cuántas tareas tienes pendientes, completadas y vencidas
- ✅ **Tema claro/oscuro** - Cambia el estilo según tu preferencia
- ✅ **Diseño responsivo** - Funciona perfectamente en desktop y dispositivos móviles
- ✅ **Interfaz moderna** - Diseño limpio y atractivo con gradientes

## 🚀 Instalación

### Requisitos previos
- Node.js 18+ instalado
- npm o yarn

### Pasos de instalación

1. **Instala las dependencias:**
```bash
npm install
```

2. **Inicia el servidor de desarrollo:**
```bash
npm run dev
```

3. **Abre en tu navegador:**
```
http://localhost:3000
```

## 📝 Uso

1. **Agregar una tarea:**
   - Escribe el texto de la tarea en el campo de entrada
   - Agrega categoría, fecha de vencimiento, prioridad y etiquetas si lo deseas
   - Presiona Enter o haz clic en el botón "Agregar"

2. **Editar una tarea:**
   - Haz clic en "Editar"
   - Actualiza los campos y guarda los cambios

3. **Marcar como completada:**
   - Haz clic en el checkbox de la tarea para marcarla como completada
   - La tarea aparecerá con una línea atravesada

4. **Eliminar una tarea:**
   - Haz clic en el botón "Eliminar" al lado de la tarea que quieres borrar

5. **Buscar y filtrar:**
   - Usa la barra de búsqueda y los selectores para filtrar por estado, prioridad o fecha

6. **Sincronizar tareas:**
   - Guarda o recupera una copia usando los botones de sincronización

## 🛠️ Comandos disponibles

```bash
# Desarrollo
npm run dev

# Producción (build y start)
npm run build
npm run start

# Linter
npm run lint
```

## 📁 Estructura del proyecto

```
.
├── app/
│   ├── components/
│   │   └── TaskManager.tsx      # Componente principal
│   ├── layout.tsx                # Layout raíz
│   ├── page.tsx                  # Página principal
│   └── globals.css               # Estilos globales
├── public/                        # Archivos estáticos
├── .eslintrc.json                # Configuración ESLint
├── .gitignore                    # Archivos ignorados por Git
├── next.config.js                # Configuración de Next.js
├── package.json                  # Dependencias del proyecto
├── tsconfig.json                 # Configuración de TypeScript
└── README.md                     # Este archivo
```

## 🎨 Tecnologías utilizadas

- **Next.js 15** - Framework de React para producción
- **React 19** - Librería de UI
- **TypeScript** - Seguridad de tipos
- **CSS3** - Estilos personalizados con gradientes y animaciones
- **localStorage** - Persistencia de datos en el navegador

## 🎯 Funcionalidades futuras

- ☐ Recordatorios y notificaciones
- ☐ Vista de calendario
- ☐ Integración con servicios externos

## 📝 Notas

- Las tareas se guardan automáticamente en localStorage
- Los datos persisten incluso después de cerrar el navegador
- Este es un proyecto de demostración, perfecto para aprender Next.js

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Creado como tutorial educativo en YouTube

---

¡Espero que disfrutes usando esta aplicación! 🎉
