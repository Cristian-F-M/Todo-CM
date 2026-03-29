<div align="center">
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 344 308" fill="none" color='white'>
<path d="M344 32V254V255.5L302.5 223V117.5L238 168.5V240.5L198 208.5V150L344 32Z" fill="currentColor"/>
<path d="M175 166.5L103 110V161L174.5 217.127L175 166.5Z" fill="currentColor"/>
<path d="M69.5 308L0 253V203L102 282.5L69.5 308Z" fill="currentColor"/>
<path d="M94.5 52.5L0 127.5V75L94 0L175 63.8518V115L94.5 52.5Z" fill="currentColor"/>
</svg>
</div>


# Todo CM 

`Todo CM` es una aplicación de lista de tareas que va más allá de lo convencional, organización por `carpetas`, `notificación` en x tiempo o a una fecha especifica, permite `cambio de temas`, creación `automática` o `manual` de temas, entre otras cosas.


## ✨ Características
- 📁 Organización por carpetas (➕ creación, ✏️ edición, 🗑️ eliminación)
- 📅🔔 Notificación de tareas
- 🎨 Cambio de temas
- 🧩 Creación de temas
- ⚙️ Configuraciones en la app
- ℹ️ Información y ayuda
- 🔄 Actualizar la app desde la propia aplicación
- 📝 Registro de logs


## 🚀 ¿Qué la hace diferente?

- Te permite cambiar de tema toda la aplicación
- Crea tus propios temas, automáticamente (selecciona el color primario) o manualmente (modifica cada color)
- Te indica cuando hay una actualización y permite actualizar desde la misma app

## 🛠️ Tecnologías

- React Native - Expo 
- SQLite / Async Storage
- Zustand 


## 📸 Capturas de pantalla

<div align="center">
  <img src="public/todo-cm-1.avif" width="200" alt="Home Screen" style="margin: 10px;" />
  <img src="public/todo-cm-4.avif" width="200" alt="Theme Creator" style="margin: 10px;" />
  <img src="public/todo-cm-5.avif" width="200" alt="Quick Add" style="margin: 10px;" />
</div>
<br>
<div align="center">
  <img src="public/todo-cm-6.avif" width="200" alt="Options" style="margin: 10px;" />
  <img src="public/todo-cm-2.avif" width="200" alt="Folder View" style="margin: 10px;" />
  <img src="public/todo-cm-3.avif" width="200" alt="Task View" style="margin: 10px;" />
</div>


## ⚙️ Instalación

1. Dirigete a la pestaña de [releases](https://github.com/Cristian-F-M/Todo-CM/releases/latest)
2. Ve hasta el final y descarga e instala el asset `todo-cm.apk`


## 🤝 Contribuir

#### Las contribuciones son bienvenidas. Haz un fork y abre un pull request.

> [!NOTE] 
> ### Requerimientos 
> - Necesitaras tener un emulador android o un dispositivo conectado con la depuración activada
> - Tener como minimo ~13GB para instalar dependencias


1. Clona el repositorio:
```bash
git clone https://github.com/Cristian-F-M/Todo-CM.git
```

2. Instala la dependencias 
```bash
npm install
# bun install | yarn install | pnpm install
```

3. Ejecutar el comando postinstall (Utilizado para parchear una librería)
```bash
npm run postinstall
# bun postinstall | yarn run postinstall | pnpm run postinstall
```

4. Ejecuta el proyecto
> [!IMPORTANT] 
> - Para ejecutar el proyecto necesitas una [development build](https://docs.expo.dev/develop/development-builds/introduction/)
> - Para la primera vez necesitaras ejecutar 
> ```bash
> npm run android
> # bun android | yarn run android | pnpm run android
> ```
> - Esto creará la development build y se instalará en el dispositivo conectado.
> - Cada que cambies librerías nativas necesitaras ejecutar el comando anterior.
> - #### Para ver la documentación completa de expo puedes visitar [expo.dev](https://docs.expo.dev/)

```bash
npm run start
# bun start | yarn run start | pnpm run start
```

## 📄 Licencia

MIT
