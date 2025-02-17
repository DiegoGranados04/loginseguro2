const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const usuario = document.getElementById('username');
    const contrasena = document.getElementById('password');
    const repetirContrasena = document.getElementById('repeatPassword'); // Nuevo campo agregado
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const errorMsg = document.getElementById('errorMsg');

    // Validación mejorada
    const validarInputs = (esRegistro = false) => {
        const usuarioRegex = /^[a-zA-Z0-9_]{4,15}$/;
        const contrasenaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

        if (!usuarioRegex.test(usuario.value)) {
            mostrarError('Usuario inválido (4-15 caracteres alfanuméricos)');
            return false;
        }

        if (!contrasenaRegex.test(contrasena.value)) {
            mostrarError('La contraseña debe tener mínimo 8 caracteres, con letras y números');
            return false;
        }

        // Validar contraseña repetida solo en el registro
        if (esRegistro && contrasena.value !== repetirContrasena.value) {
            mostrarError('Las contraseñas no coinciden');
            return false;
        }

        return true;
    };

    const mostrarError = (mensaje) => {
        errorMsg.textContent = mensaje;
        setTimeout(() => errorMsg.textContent = '', 5000);
    };

    // Manejo de Login
    const handleLogin = async () => {
        if (!validarInputs()) return;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: usuario.value,  
                    password: contrasena.value
                })
            });

            const data = await response.json();
            console.log("Respuesta del servidor (Login):", data);

            if (!response.ok) {
                throw new Error(data.error || 'Error en el login');
            }

            localStorage.setItem('authToken', data.token);
            window.location.href = 'dashboard.html';
        } catch (error) {
            mostrarError(`Error: ${error.message}`);
        }
    };

    // Manejo de Registro (ahora con repeatedPassword)
    const handleRegister = async () => {
        if (!validarInputs(true)) return;

        try {
            const response = await fetch(`${API_URL}/sign-up`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: usuario.value,  
                    password: contrasena.value,
                    repeatedPassword: repetirContrasena.value  // Nuevo campo agregado
                })
            });

            const data = await response.json();
            console.log("Respuesta del servidor (Registro):", data);

            if (!response.ok) {
                throw new Error(data.error || 'Error en el registro');
            }

            mostrarError('¡Registro exitoso! Por favor inicia sesión');
            usuario.value = '';
            contrasena.value = '';
            repetirContrasena.value = '';  // Limpiar campo de repetición
        } catch (error) {
            mostrarError(`Error: ${error.message}`);
        }
    };

    loginBtn.addEventListener('click', handleLogin);
    registerBtn.addEventListener('click', handleRegister);
});
