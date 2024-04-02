# Azalea - Participa

Azalea - Participa es una aplicación web de participación ciudadana diseñada para fomentar la interacción de la comunidad universitaria con proyectos de infraestructura urbana. La aplicación proporciona una plataforma interactiva que permite a los usuarios reportar incidencias, expresar preocupaciones y sugerir mejoras en su entorno urbano.

## Funcionalidades clave

 * **Mapa interactivo**: Los usuarios pueden visualizar incidencias reportadas en un mapa geográfico, lo que facilita la identificación de áreas problemáticas en el entorno urbano.

 * **Reporte de incidencias**: Los usuarios pueden reportar nuevas incidencias, proporcionando detalles sobre el problema observado y su ubicación geográfica precisa.

 * **Comentarios y apoyo**: Los usuarios pueden comentar en las incidencias existentes y expresar su apoyo a situaciones específicas, fomentando la interacción y el intercambio de ideas dentro de la comunidad.

## Ejecución con Docker

### Requisitos previos

Docker instalado en tu sistema.

### Pasos para ejecutar el proyecto con Docker

#### Clona el repositorio:

```bash
git clone git@github.com:Azalea-UPV/glocal.git
cd glocal
```

#### Ejecuta el docker-compose:

```bash
docker-compose up
```

El docker-compose ejecutará tres procesos. El primero compilará la web. El segundo comenzará a funcionar una vez la web esté compilada, se trata del servidor nginx. El tercero es el backend.

## Configuración

Para conectar el frontend con el backend, existe un archivo config.js en el servidor de nginx. Puedes editar este archivo directamente, o, si piensas recompilar la web, el archivo config.js de la carpeta public/ del frotend. El contenido del archivo es el siguiente:

```javascript
const env = {
    APP_NAME: "Azalea Participación",
    APP_ICON_URL: "/azalea-icon.png",
    SERVER_URL: "http://localhost:5000",
    TILES_URL: "/tiles/{z}/{x}/{y}.png"
}
```
Las variables son las siguientes:

 * APP_NAME: Indica el nombre de la aplicación. Este nombre es el que se mostrará en la pestaña.
 * APP_ICON_URL: Indica el icono de la pestaña de la aplicación.
 * **SERVER_URL**: Es la url del backend. Si se monta en deploy, **nunca** poner localhost, ya que se buscará en el cliente que está viendo la web, y no en nuestro servidor backend.
 * TILES_URL: Es la url de los teseles del mapa. Si no sabes qué es o qué poner, puedes utilizar openstreetmap poniendo la url: ```https://tile.openstreetmap.org/{z}/{x}/{y}.png```

 La primera vez que se ejecute la aplicación, se tendrá que registrar un usuario, y desde un cliente para sqlite, editar la base de datos para que dicho usuario sea administrador. La base de datos está en ```server/data/database.sqlite```. Inicia sesión con este usuario y ve a ```/config```. En esta página tendrás que establecer los límites de uso de la aplicación.

## Documentación del proyecto

En este repo, están los documentos consultados para crear la aplicación, en la carpeta ```documentacion/```. También hay un informe técnico en LaTeX, para poder copiarlo fácilmente por cualquier requerimiento.