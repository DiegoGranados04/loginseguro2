const API_URL = 'http://localhost:3000/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    const usuario = document.getElementById('username');
    const contrasena = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const errorMsg = document.getElementById('errorMsg');

    // Validación mejorada
    const validarInputs = () => {
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
                    username: usuario.value,
                    password: contrasena.value
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('authToken', data.token);
                window.location.href = 'dashboard.html';
            } else {
                mostrarError(data.error || 'Error en el login');
            }
        } catch (error) {
            mostrarError('Error de conexión con el servidor');
        }
    };

    // Manejo de Registro
    const handleRegister = async () => {
        if (!validarInputs()) return;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: usuario.value,
                    password: contrasena.value
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                mostrarError('¡Registro exitoso! Por favor inicia sesión');
                usuario.value = '';
                contrasena.value = '';
            } else {
                mostrarError(data.error || 'Error en el registro');
            }
        } catch (error) {
            mostrarError('Error de conexión con el servidor');
        }
    };

    loginBtn.addEventListener('click', handleLogin);
    registerBtn.addEventListener('click', handleRegister);
});