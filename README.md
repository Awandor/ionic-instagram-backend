# INSTAGRAM APP BACKEND

Aquí creamos nuestro backend para el manejo de una aplicación completa muy parecida a Instagram.

Empezamos por el manejo de usuarios y la autenticación por tokens para que nuestra app de forma pasiva puedan validar la sesión del usuario.

Nos conectaremos con MongoDB para el manejo de usuario y la información de los POSTs que serán nuestras entradas a la app


## MongoDB

Para nuestro backend usaremos la base de datos MongoDB

vamos a mongodb.com

Instalamos la versión Community Edition on Windows, conviene revisar las instrucciones de instalación

> `https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/`

Nos bajamos y ejecutamos el instalador y lo instalamos como servicio, dejamos los demás settings por defecto

Deseleccionamos Compass pues vamos a usar otra herramienta gráfica para interactuar con mongoDB

Una vez instalado lo ejecutamos > `C:\Program Files\MongoDB\Server\4.4\bin\mongo.exe` esto levanta la base de datos abriendo una consola

## Robo 3T

Robo 3T es una herramienta gráfica para gestionar la base de datos mongoDB

Si no tenemos instalado Robo 3T lo instalamos de > `https://robomongo.org/` No la versión Studio

Ejecutamos Robo 3T, si no tenemos la conexión creada, la creamos, dejamos localhost y ponemos el puerto que está escuchando mongoDB
para ello nos fijamos en el feedback de la consola > `connecting to: mongodb://127.0.0.1:27017`


# Creamos el backend

Crearemos el backend con node.js

Creamos carpeta de proyecto y dentro de él iniciamos un proyecto de node > `npm init`

Esto va a crear el archivo `package.json` con la info inicial del proyecto

El proceso nos hace varias preguntas, aceptamos todas las sugerencias

Ya tenemos generado el archivo `package.json`

Creamos `index.ts` este va a generar el `index.js` que es la entrada al backend tal y como hemos aceptado en `npm init`

Escribimos un `Hola mundo` por consola en `index.ts`

> `tsc index.ts` Genera `index.js`

Ahora ejecutamos la app > `node index.js`

Vemos en la consola `Hola mundo`

tsc es la referencia a Typescript Compiler

Ahora vamos a generar `tsconfig.json`

> `tsc --init`

Abrimos `tsconfig.json` aquí tenemos todas las reglas del compilador

1. Cambiamos `target` a `es6`
2. Quitamos el comentario de `outDir`y lo ponemos a `dist/` aquí es donde se almacenarán los archivos compilados

Para generar la compilación automática > `tsc -w`

Podemos comprobar > `node dist/` Nos devuelve `Hola mundo` en consola

Para no tener que estar escribiendo `node dist/` todo el rato para ejecutar la app instalamos nodemon `https://nodemon.io/`

> `npm install -g nodemon` como administrador

> `nodemon dist` Escucha cambios y ejecuta `dist/index.js`


## Instalación de paquetes necesarios

Instalamos en una tercera consola

`npm install express` Permite crear rápidamente un servidor web y trae todo lo necesario para montar un servidor Rest
`npm install body-parser` Permite recibir la info que recibo de POST, PUT, PATCH... y transformarlo en un objeto de js
`npm install cors` Para hacer peticiones Http cross domain
`npm install mongoose` Para trabajar con el modelado de datos del lado de node y hacer interacciones directamente con bbdd
`npm install express-fileupload` Para poder recibir las peticiones de imágenes que vamos a postear en la app
`npm install jsonwebtoken` Para la autenticación, crearemos web tokens para mantener de forma pasiva el estado de la sesión
`npm install bcrypt` Para encriptar las contraseñas de los usuarios

O bien en una sóla línea:

`npm install express body-parser cors mongoose express-fileupload jsonwebtoken bcrypt`

Esto crea la carpeta `node_modules` con todas las dependencias y actualiza `package.json`


## Creación de una instancia del servidor express

Creamos carpeta `classes` donde vamos a colocar todas las clases necesarias para nuestro proyecto

Creamos dentro el archivo `server.ts` y creamos una clase normal de js y la exportamos

Instalamos `@types/express` que es una dependencia de desarrollo que nos ayuda con el tipado de express
> `npm install @types/express --save-dev`

Importamos `express` y creamos dos propiedades públicas y el constructor que inicia express

Creamos un método que escucha peticiones que se realicen al puerto

Ahora en index.ts creamos una instancia de la clase server


## Crear servicios Rest en Express

Creamos carpeta routes y dentro archivo usuario.ts

Este archivo será el que usaremos para definir todas las rutas y servicios que tengan que ver con el usuario:
login, crear usuario, editar usuario, borrar usuario

Importamos Router de express que nos da métodos post, get, put, etc.

Creamos un método get y lo exportamos

Para probarlo abirmos Postman y GET `localhost:3000/user/prueba` y recibimos el ok y el mensaje


## Levantar la bbdd de mongoDB y conectar la app

Para poder escuchar peticiones de nuestra app conectamos nuesta app de node con mongoDB para ello usamos mongoose

Para que mongoose sea reconocido por TS > `npm install @types/mongoose --save-dev` esto instala el tipado de mongoose para TS
y lo incorpora a `package.json` como dependencia de desarrollo

Casi todos los paquetes npm tienen un paquete de reconocimento TS que se llama @types/nombre del paquete

Creamos una conexión a la base de datos mongoDB


## Creamos Modelo Usuario para la base de datos

Las bases de datos no relacionales como mongoDB no tienen tablas sino modelos donde se almacenan los datos

Creamos carpeta models y dentro `usuario-model.ts`

Los modelos contienen los campos que voy a necesitar. Para ello importamos `Schema` y `model` de mongoose

Con `Schema` definimos los campos con sus propiedades y con `model` le damos un nombre y le incorporamos el `Schema` y lo exportamos

Podemos definir una interface que nos ayude con el tipado y creamos un Tipo para nuestro modelo de usuario


## Creamos un usuario

Vamos a `index.ts` 

Vamos a importar `bodyParser` que nos ayuda transformando lo que recibimos de un POST, PUT, PATCH... (el body) en un objeto js manejable

El middleware es una función que se ejecuta antes de cualquier otra en nuestra app, los `use` son middlewares

Ahora usando el middleware `use` pasamos `server.app` por `bodyParser`

Vamos a `usuario.ts` y creamos un post `create` y lo probamos en Postman

En Postman POST `localhost:3000/user/create` y Body > x-www-form-urlencoded

`x-www-form-urlencoded` es habitualmente usado por Angular, nuestro front será creado con Angular + Ionic y enviará datos en este formato

Rellenamos los datos nombre, password, email y presionamos Send simulando que nos llega al backend estos datos del front.

Ahora con el método de mongoose `create` guardamos en base de datos.

Otra característica de las bases de datos no relacionales es que podemos crear modelos directamente desde el backend al insertar la
primera colección, no hace falta crear el modelo perviamente en mongoDB.


## Encriptar la contraseña

En `usuario.ts` donde creamos el usuario vamos a encriptar la contraseña usando `bcrypt`

Para que `bcrypt` sea reconocido por TS > `npm install @types/bcrypt --save-dev` esto instala el tipado de `bcrypt` para TS
y lo incorpora a `package.json` como dependencia de desarrollo


## Login de usuario

En `usuario.ts` creamos la ruta login

Creamos un método `compararPassword` que compara el password y lo añadimos al interface


## Creación de JsonWebTokens

Creamos una clase para la generación de tokens llamada `token.ts`, todas las propiedades y métodos de esta clase van a ser estáticos con `static`

Usaremos `jsonwebtoken` para que `jsonwebtoken` sea reconocido por TS > `npm install @types/jsonwebtoken --save-dev` esto instala el tipado de `jsonwebtoken` para TS y lo incorpora a `package.json` como dependencia de desarrollo

Creamos método `getJsonwebtoken` que genera un token y lo implementamos en `usuario.ts` en la ruta del `login`

Creamos método `comprobarToken` que toma un token como argumento y comprueba y retorna una promesa.


## Verificación de un JsonWebToken

Vamos a crear algo donde necesitemos verificar el token.

Creamos una nueva ruta `edit` en `usuario.ts`

Vamos a crear una función middleware y la centralizamos en carpeta middlewares y archivo `autenticacion.ts`

Importamos de express unos interfaces y exportamos una función `verificaToken` que implementa `comprobarToken` de la clase Token

Ahora llamamos la función middleware `verificaToken` en `usuario.ts` en la ruta `editar` como segundo argumento


## Actualizar un usuario de la base de datos

Vamos a la ruta `edit` en `usuario.ts`

Utilizamos el método `findByIdAndUpdate` de mongoose


## Borrar un usuario de la base de datos

Creamos una nueva ruta `delete` en `usuario.ts`

Utilizamos el método `findByIdAndDelete` de mongoose

## Retornar información del usuario por Token

Vamos a `usuario.ts` y añadimos un servicio de obtener información del usuario a partir del Token

Nos va a venir bien para comprobar en el frontend si un usuario está loggeado y para implementar guards que protejen ciertas rutas


# Mensajes

## Creamos Modelo Mensaje para la base de datos

Creamos carpeta models y dentro `mensaje-model.ts`

Los modelos contienen los campos que voy a necesitar. Para ello importamos `Schema` y `model` de mongoose

Con `Schema` definimos los campos con sus propiedades y con `model` le damos un nombre y le incorporamos el `Schema` y lo exportamos

Podemos definir una interface que nos ayude con el tipado y creamos un Tipo para nuestro modelo de mensaje

## Servicio para crear un Mensaje

Creamos un nuevo archivo `mensaje.ts` en routes

Vamos a `index.ts` y definimos la nueva ruta

En `mensaje.ts` creamos la ruta `'/'` obtenemos el id del usuario y el body del front y grabamos en base de datos con `create`


## Servicio para obtener los mensajes de forma paginada

En `mensaje.ts` creamos una nueva ruta para obtener mensajes con GET y usamos el método `find`

Ordenamos desc, Limitamos a 10, Añadimos los datos del usuario sin la contraseña.

Para decidir si mostramos los primero diez o los siguientes, es decir aplicar la función de paginación usamos el método de mongoose `skip`


## Servicio para subir archivos del front al backend

Necesitamos trabajar con otro middleware `fileupload` lo importamos en `index.ts`

Para que TS lo reconozca como Type > `npm install @types/express-fileupload --save-dev`

Ahora lo configuarmos en `index.ts` usando `use`

`fileupload` toma los archivos recibidos desde el front y los almacena en un lugar llamado `files`

Ahora creamos un servicio para subir los archivos en `mensaje.ts`

Probamos en Postman enviando el token y form-data tipo file

Vamos a crear una interface del objeto file, creamos carpeta `interfaces` y dentro archivo `file-upload.ts` esta interface tendrá
los datos que nos interesa. Ya tenemos nuestro tipo `FileUpload` que podemos importar en `mensaje.ts`

Vamos a limitar la subida de archivos a que sean de tipo imagen

Las imágenes son almacenadas en este punto en un directorio temporal


## Tratamiento de las imágenes

Cuando un usuario sube una imagen desde el front nos llega al backend el ID del usuario y su token.
También nos llega una o varias imágenes. Queremos dar un nombre único a cada imagen.

Crearemos una carpeta `uploads` dentro de ella cada usuario que suba una imagen se le creará si no la tiene creada ya una carpeta con
el nombre del id del usuario. Dentro habrá otras dos carpetas, una `temp` donde se almacena temporalmente la imagen en espera de crear
un Mensaje y otra `imagenes` con las imágenes definitivas usadas en los mensajes


## Crear una clase para manejar FileSystem

 Creamos la carpeta `uploads` en la parte TS del proyecto y también en `dist` el proyecto compilado de node

 En `classes` creamos archivo nuevo `file-system.ts` y creamos las clase `FileSystem` que tiene el método `guardarImagenTemporal`

 Para trabajar con el path importamos un paquete de Node `path` y para trabajar con carpetas y archivos hay otro paquete `fs` (file system)
 de Node que hay que importar

 Ahora vamos a `mensajes` y creamos una instancia de la clase `FileSystem` y llamamos al método `guardarImagenTemporal`

 Al hacer una prueba en Postman vemos que se crea la carpeta del usuario en `dist/uploads`


 ## Generar un nombre único de archivo

 Necesitamos instalar un paquete de Node que genera id únicos > `npm install uniqid`

 Para que TS lo reconozca como Type > `npm install @types/uniqid --save-dev`

 Lo importamos en la clase `file-system.ts` y creamos el método `generarNombreUnico`

 Ya podemos utilizarlo en el método `guardarImagenTemporal`


## Mover archivo físico de zona Temp de node a carpeta temp

El método `mv` nos lo entrega ... y permite mover archivos

En la interface `file-upload.ts` añadimos el método sin definir `mv` para que no nos dé error

En la clase `file-system.ts` implementamos el método `mv` en `guardarImagenTemporal`

Lamentablemente el método `mv` no retorna promesa sino funciona con un callback

Para evitar caer en el infierno de los callback vamos a forzar a que nos retorne una promesa

Queremos asegurarnos de que el archivo ha sido movido antes de retornar un mensaje de éxito al usuario

Probamos en Postman y vemos que el archivo ha sido movido a la carpeta `temp` de `dist/uploads`


## Mover archivo de la carpeta temp a la carpeta images

Vamos a `mensaje.ts` a la parte donde se crea el mensaje ahí queremos obtener un arreglo con los nombres de los
archivos guardados en la carpeta `temp`

Para ello vamos a crear en `file-system.ts` un método `moverArchivoTemp` que mueva los archivos de `temp` a `images` será un método
público para que se pueda llamar desde fuera de la clase, como argumento toma userId para que se mueva todo el
contenido de temp a images de ese userId

Ahora llamamos al método `moverArchivoTemp` desde `mensaje.ts`

Probamos en Postman creando un nuevo Mensaje con el token que hemos utilizado para subir imágenes.
Las imágenes desaparecen de temp y son movidas a images, Postman nos retorna los nombres de las imágenes y en Robo T3
vemos que han sido almacenadas en la base de datos de Mongo


## Servicio para mostrar una imagen por URL

Vamos a `mensaje.ts` y creamos un servicio para mostrar la imagen


Creamos en `file-system.ts` el método público `getImagenUrl` que nos retorna el path de la imagen

Si la imagen no existe queremos mostrar una imagen por defecto.

Creamos una carpeta `assets` y en ella metemos una imagen por defecto. Como assets no tiene ningún archivo TS,
el compilador la va a ignorar por lo que debemos de copiarla y pegarla en la carpeta `dist`


## Resolver problema de peticiones CROSS DOMAIN (CORS)

Hay muchas maneras de configurarlo, como aceptar peticiones de ciertos dominios

Vamos a `index.ts` debajo de File Upload

Ya tenemos instalado en el proyecto `cors`
Para que TS lo reconozca como Type > `npm install @types/cors --save-dev`


## Crear una base de datos Mongo en el Cloud de Mongo

Vamos a `mongodb.com`, creamos una cuenta de usuario, un nombre de organización, un primer proyecto

Creamos un `Cluster de tipo Free`, elegimos el `Cloud Provider y la región` y en la parte de abajo > `Create Cluster`, tarda unos minutos

Vamos a `Connect` > Escogemos la `IP` que tendrá acceso a la base de datos, se puede dejar de libre acceso

Creamos un usuario de base de datos y una contraseña

`Choose connection method` > `Connect your application`

Copiamos la ruta a la base de datos, en esta ruta cambiamos el usuario por el nuestro y ponemos el nombre de la base de datos
que queramos, no puede tener espacios en blanco y se genera al vuelo la primera vez que nos conectamos a la bbdd

La pegamos en `index.ts` en `mongoose.connect` con los parámetros que usabamos en local


## Desplegar backend a servidor Hereku

1. Crear cuenta en Hereku
2. Crear aplicación
3. Desplegar usando Hereku Git
4. Instalar Hereku CLI, instalar EXE y reiniciar PC, cuidado de no tener el móvil conectado por USB

Comprobar que Hereku está instalado > `hereku --version`

5. Login en Hereku: `heroku login`
6. Vincular repositorio GIT al proyecto Hereku > `heroku git:remote -a awandor-instagram-app`
7. Subir repositorio GIT a Hereku > `git push heroku master`

En settings puedo ver la url > `https://awandor-instagram-app.herokuapp.com/`

La app no funciona aun, Heroku no sabe copmo inicializarla, tenemos que crear un Procfile que le da instrucciones a Heroku de
como iniciar la app, queremos que lo haga de la misma manera en que lo hacemos de forma local

Creamos archivo `Procfile` sin extensión que tiene esta línea: `web: node index.js`

Ahora tenemos que cambiar el puerto que escucha a uno que nos proporciona Heroku mediante la variable `process.env.PORT` en `server.ts`
y si no está disponible la variable como cuando estamos corriendo en local, que utilice el puerto original `3000`

Añadimos los cambios al repositorio local de Git, hacemos el commit y el push a `Heroku`


# GIT

En nuestra cuenta de github creamos un repositorio

Si no tenemos repositorio git local lo creamos > `git init`

Si no tenemos archivo `.gitignore` lo creamos, especialmente para evitar `node_modules`

Añadimos los cambios a GIT> `git add .`
Commit > `git commit -m "Primer commit"`

Si en este punto borro accidentalmente algo puedo recuperarlo con > `git checkout -- .`

Que nos recontruye los archivos tal y como estaban en el último commit.

Enlazamos el repositorio local con un repositorio externo en GitHub donde tenemos cuenta y hemos creado un repositorio
`git remote add origin https://github.com/Awandor/ionic-instagram-backend.git`

Situarnos en la rama master > `git branch -M master`

Subir todos los cambios a la rama master remota > `git push -u origin master`

Para reconstruir en local el código de GitHub nos bajamos el código y ejecutamos `npm install` que instala todas las dependencias


## Tags y Releases

Crear un tag en Github y un Release

> `git tag -a v1.0.0 -m "Versión 1 - Lista para producción"`

> `git tag` muestra los tags

> `git push --tags` > sube los tags al repositorio remoto

En github vamos a Tags > Add release notes

