const API_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('authToken');

// Función de logout
const logout = () => {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
};

document.addEventListener('DOMContentLoaded', async () => {
    if (!token) {
        alert('No tienes permiso para acceder aquí');
        window.location.href = 'login.html';
        return;
    }

    await cargarUsuarios();
});

const cargarUsuarios = async () => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al obtener usuarios');
        }

        mostrarUsuarios(data);
    } catch (error) {
        alert(`Error al obtener usuarios: ${error.message}`);
    }
};

const mostrarUsuarios = (usuarios) => {
    const tablaUsuarios = document.getElementById('usuariosTableBody');
    tablaUsuarios.innerHTML = '';

    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${usuario.userName}</td>
            <td>${usuario.role}</td>
            <td>
                <input type="checkbox" 
                       ${usuario.isActive ? 'checked' : ''} 
                       onchange="actualizarEstadoUsuario('${usuario.id}', this.checked)"
                       class="estado-checkbox">
            </td>
        `;
        tablaUsuarios.appendChild(fila);
    });
};

const actualizarEstadoUsuario = async (id, nuevoEstado) => {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ isActive: nuevoEstado })
        });

        if (!response.ok) throw new Error('Error al actualizar estado');
        
        await cargarUsuarios();
    } catch (error) {
        alert(error.message);
        await cargarUsuarios();
    }
};