
// GENERACION DEL MAPA
var map = L.map('map').fitWorld();
var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="">Geocar</a>'
}).addTo(map);

var punto = L.layerGroup().addTo(map);

// GENERAMOS UNA LISTA DE HISTORIAL
var historial = [];

// INICIALIZAMOS EL MODO DE AÑADIR Y UBICACIONES
var modoAñadirActivado = false;
var ubicacionGuardada = null;
var ubicacionActual = null;


// FUNCION PARA ESTABLECER SI ESTA ACTIVO O DESACTIVADO PONER WAYPOINTS
document.getElementById('añadir').addEventListener('click', function () {
    modoAñadirActivado = !modoAñadirActivado;
    alert("Modo añadir " + (modoAñadirActivado ? "activado" : "desactivado"));
});

// ASIGNACION DE FUNCIONES A LOS BOTONES

document.getElementById('eliminar').addEventListener('click', eliminarMarcador);

document.getElementById('historico').addEventListener('click', mostrarHistorico);

document.getElementById('cerrarHistorico').addEventListener('click', cerrarHistorico);

document.getElementById('cancelar').addEventListener('click', function () {
    document.getElementById('UbicacionDialog').close();
});

document.getElementById('guardar').addEventListener('click', function () {
    var nombreUbicacion = document.getElementById('nombreUbicacionInput').value.trim(); // LE AÑADO EL TRIM PARA BORRAR LOS ESPACIOS EN BLANCO
    if (nombreUbicacion && ubicacionGuardada && ubicacionActual) {
        var distancia = ubicacionActual.distanceTo(ubicacionGuardada).toFixed(2); // OBTENGO LA DISTANCIA QUE HAY Y LA REDONDEO A DOS DECIMALES
        var tiempoTranscurrido = new Date().toLocaleString();  // GENERO UNA NUEVA FECHA Y LA ALMACENO 
        var waypoint = L.marker(ubicacionGuardada).addTo(punto);  // SE CREA EL WAYPOINT
        waypoint.bindPopup(`Waypoint: ${nombreUbicacion}<br>Distancia desde tu posición: ${distancia} metros`).openPopup(); // IMPRIME ESA ETIQUETA EN EL WAYPOINT
        actualizarPanel(nombreUbicacion, distancia, tiempoTranscurrido);  // ACTUALIZACION PANEL DE INFROMACION
        historial.push({ nombre: nombreUbicacion, distancia: distancia, tiempo: tiempoTranscurrido }); // CARGA A LA LISTA DEL HISTORIAL LOS DATOS DEL WAYPOINT
        document.getElementById('UbicacionDialog').close(); // CIERRA EL DIALOG
    } else {
        alert('Por favor, ingrese un nombre válido para el waypoint y haga clic en el mapa para seleccionar una ubicación.'); // CASO DE FALLO 
    }
});

map.on('click', function (e) {
    if (modoAñadirActivado) {
        ubicacionGuardada = e.latlng; // GUARDO EN LA VARIABLE "ubicacionGuardada" LAS CORDENADAS DEL WAYPOINT
        document.getElementById('UbicacionDialog').showModal();
    }
});

map.on('locationfound', function (e) {
    const radius = e.accuracy / 2; // RADIO DE NUESTRA UBICACION (CIRCULO AZUL)
    ubicacionActual = e.latlng; // GUARDO EN LA VARIABLE "ubicacionActual" LAS CORDENADAS DE LA UBICACION ACTUAL
    L.marker(e.latlng).addTo(map).bindPopup(`Ubicación actual`).openPopup(); // ASIGNACION DE WAYPOINT DE UBICACION ACTUAL
    L.circle(e.latlng, radius).addTo(map); // ASIGNACION DE RADIO DE UBICACION ACTUAL
});

map.on('locationerror', function (e) {
    alert(e.message);
});


// FUNCION LIMPIA HISTORIAL Y TODOS LOS WAYPOINTS
function eliminarMarcador() {
    punto.clearLayers();
    historial = [];
    cerrarPanel();
}


// FUNCION ABRE HISTORIAL Y CARGA TODOS LOS DATOS DE LOS WAYPOINTS
function mostrarHistorico() {
    var historicoList = document.getElementById('listaHistorico');
    historicoList.innerHTML = '';
    historial.forEach(function (item) {
        var listItem = document.createElement('li');
        listItem.textContent = `${item.nombre} - ${item.distancia}m - ${item.tiempo}`;
        historicoList.appendChild(listItem);
    });
    document.getElementById('historicoDialog').showModal();
}


// FUNCION CERRAR DIALOG
function cerrarHistorico() {
    document.getElementById('historicoDialog').close();
}

// FUNCION ACTUALIZAR PANEL
function actualizarPanel(nombre, distancia, tiempo) {
    document.getElementById('ubicacion').textContent = `Ubicación: ${nombre}`;
    document.getElementById('distancia').textContent = `Distancia al coche: ${distancia} metros`;
    document.getElementById('tiempo').textContent = `Fecha del Waypoint: ${tiempo}`;
}

function cerrarPanel() {
    document.getElementById('ubicacion').textContent = 'Ubicación: ';
    document.getElementById('distancia').textContent = 'Distancia al coche: ';
    document.getElementById('tiempo').textContent = 'Fecha del Waypoint: ';
}

map.locate({ setView: true, maxZoom: 16 });
