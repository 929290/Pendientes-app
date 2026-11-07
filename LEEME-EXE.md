# Pendientes para Windows (.exe)

1. Crea un repositorio PÚBLICO nuevo en GitHub (por ejemplo `Tareas-PC`).
2. Sube TODO el contenido de esta carpeta (incluida `build/`). `config.js` ya trae tu Supabase.
3. Crea a mano el archivo `.github/workflows/build-exe.yml` (Add file > Create new file) y pega su contenido.
4. Pestaña Actions > "Compilar EXE (Windows)" > Run workflow. Tarda unos 5 a 10 minutos.
5. En Releases descarga `Pendientes-Setup.exe` (instalador) o `Pendientes-Portable.exe`.
Si Windows dice "protegió su PC": Más información > Ejecutar de todas formas (el instalador no está firmado).

## Novedades de la versión 1.2
- **Resumen** (abajo a la izquierda): racha de días, gráfica de completadas por día e historial.
- **Ajustes**: tema claro / oscuro / como Windows, vista en lista compacta y copia de seguridad (exportar / importar).
- **Captura rápida**: `Ctrl + Alt + Espacio` desde cualquier programa (con la app abierta, aunque esté minimizada).
- Archivos nuevos que también hay que subir: `preload.js`, `quick.html`, `quick.js`, `theme.js`.
- Actualiza la app en todos tus equipos: las versiones anteriores mostrarían las tareas borradas que se guardan para el historial.
