// Crea una nueva instancia de la API de Particle
const particle = new Particle();
let token; // Variable para almacenar el token de autenticación
let valor; // Variable para almacenar el valor recibido del dispositivo

// Espera a que todo el contenido del DOM esté cargado
document.addEventListener("DOMContentLoaded", function() {
    // Obtiene el slider por su ID
    const slider = document.getElementById("Ktms");

    // Función para actualizar el círculo con el valor actual del slider
    function updateCircle(value) {
        const min = 5; // Valor mínimo del slider
        const max = 20; // Valor máximo del slider
        // Calcula el porcentaje del valor actual en relación con el rango
        const percent = ((value - min) / (max - min)) * 100;
        
        // Obtiene el círculo y el valor a mostrar en el DOM
        const circle = document.getElementById('circle');
        const output = document.getElementById('Kvaluetms');

        // Calcula los grados para el gradiente basado en el porcentaje
        const degrees = (percent / 100) * 360;
        
        // Aplica un gradiente dinámico al círculo
        circle.style.background = `conic-gradient(blue 0deg, blue ${degrees}deg, lightgray ${degrees}deg, lightgray 360deg)`;
        
        // Actualiza el valor mostrado dentro del círculo
        output.textContent = value;
    }

    // Cuando el valor del slider cambia, ejecuta esta función
    slider.addEventListener("input", function() {
        const value = this.value; // Obtiene el valor actual del slider
        updateCircle(value); // Llama a la función para actualizar el círculo

        // Prepara el valor a enviar al dispositivo Particle
        let Salida = value;
        // Llama a una función del dispositivo Particle con el valor actual del slider
        particle.callFunction({ 
            deviceId: '0a10aced202194944a058b28', // ID del dispositivo
            name: 'TMS_2', // Nombre de la función en el dispositivo
            argument: Salida, // Argumento que se pasa a la función
            auth: token // Token de autenticación obtenido tras iniciar sesión
        })
        .then(() => {
            console.log('Función llamada exitosamente'); // Si la llamada fue exitosa
        })
        .catch(err => {
            console.error('Error al llamar a la función:', err); // Si hubo un error
        });
    });

    // Inicializa el círculo con el valor actual del slider al cargar la página
    updateCircle(slider.value);
});

// Inicia sesión en Particle con un nombre de usuario y contraseña
particle.login({username: 'hectorjesus029@gmail.com', password: 'PAR2002hector'})
    .then(data => {
        token = data.body.access_token; // Guarda el token de autenticación una vez que se ha iniciado sesión
    })
    .catch(err => {
        console.log('No se pudo iniciar sesión.', err); // Si hubo un error al iniciar sesión
    });

// Función que se ejecuta cada segundo para obtener una variable del dispositivo Particle
setInterval(function() {
    // Obtiene el valor de la variable 'VALOR' del dispositivo
    particle.getVariable({
        deviceId: '0a10aced202194944a058b28', // ID del dispositivo
        name: 'VALOR', // Nombre de la variable en el dispositivo
        auth: token // Token de autenticación
    })
    .then(data => {
        console.log("Variable del dispositivo recibida correctamente: ", data); // Muestra el valor recibido en la consola
        valor = data.body.result; // Almacena el valor en la variable 'valor'
        
        // Actualiza el contenido de un elemento HTML con el valor recibido
        const resultElement = document.getElementById('valor'); // Obtiene el elemento con ID 'valor'
        if (resultElement) {
            resultElement.textContent = valor; // Actualiza el texto del elemento con el valor
        }
    })
    .catch(err => {
        console.log("Un error ocurrió al obtener la variable: ", err); // Muestra un error si ocurre al obtener la variable
    });
}, 1000); // Repite esta operación cada 1000 milisegundos (1 segundo)
