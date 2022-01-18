//configuracion websocket
const express = require("express");
const res = require("express/lib/response");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
// FIN configuracion websocket
const PORT = 3000 || process.env.PORT;
const Contenedor = require("./class/Contenedor");
const filePathProducts = "./db/productos.txt";
const filePathMessages = "./db/messages.txt";
const handlerProducts = new Contenedor(filePathProducts);
const handlerMessages = new Contenedor(filePathMessages);
const generarUsuarios = require("./utils/generarUsuarios");
const listarMensajesNormalizados = require("./utils/listarMensajesNormalizados");
const objectSession = require("./config/session");
const session = require("express-session");
const path = require ("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set("view engine", "ejs");

app.use(session(objectSession));

//websocket
//abre canal de parte del servidor
//connection EVENTO
io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  //Socket PRODUCTOS
  socket.emit("server_sendProducts", await handlerProducts.getAll());

  socket.on("client_newProduct", async (item) => {
    await handlerProducts.save(item);
    io.emit("server_sendProducts", await handlerProducts.getAll());
  });
  //FIN Socket PRODUCTOS

  //Socket MENSAJES
  socket.emit(
    "server_sendMessages",
    listarMensajesNormalizados(await handlerMessages.getAll())
  );

  socket.on("client_newMessage", async (objmessage) => {
    await handlerMessages.save(objmessage);
    io.emit(
      "server_sendMessages",
      listarMensajesNormalizados(await handlerMessages.getAll())
    );
  });
});

app.get("/api/productos-test", (req, res) => {
  res.json(generarUsuarios());
});

app.get('/', (req, res) => {
  res.redirect('/home')
})

app.get("/home", (req, res) => {
  const nombre = req.session.nombre;
  console.log(nombre);
  if (!nombre) {
    return res.redirect("/login");
  }

  res.render(path.join(process.cwd(), "public/index.ejs"), {
    nombre: req.session.nombre,
  });
});

app.get('/login', (req, res) => {
  const nombre = req.session.nombre
  if (nombre) {
      res.redirect('/')
  } else {
      res.sendFile(path.join(process.cwd(), 'public/views/login.html'))
  }
})

app.post('/login', (req, res) => {
  req.session.nombre = req.body.nombre
  res.redirect('/home')
})

app.get('/logout', (req, res) => {
  const nombre = req.session.nombre
  if (nombre) {
      req.session.destroy(err => {
          if (!err) {
              res.render(path.join(process.cwd(), 'public/views/pages/logout.ejs'), { nombre })
          } else {
              res.redirect('/')
          }
      })
  } else {
      res.redirect('/')
  }
})

server.listen(PORT, () => {
  console.log(
    `El servidor se encuentra escuchando por el puerto ${server.address().port}`
  );
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
