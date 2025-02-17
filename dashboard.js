const API_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('authToken'); // Obtener token guardado

// Verificar si el usuario es ADMIN antes de cargar la tabla
document.addEventListener('DOMContentLoaded', async () => {
    if (!token) {
        alert('No tienes permiso para acceder aquí');
        window.location.href = 'index.html';
        return;
    }

    await cargarUsuarios();
});

// Función para obtener y mostrar usuarios
const cargarUsuarios = async () => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });

        const data = await response.json();
        console.log("Usuarios obtenidos:", data);

        if (!response.ok) {
            throw new Error(data.error || 'Error al obtener usuarios');
        }

        mostrarUsuarios(data);
    } catch (error) {
        console.error('Error:', error);
        alert(`Error al obtener usuarios: ${error.message}`);
    }
};

// Función para mostrar usuarios en una tabla
const mostrarUsuarios = (usuarios) => {
    const tablaUsuarios = document.getElementById('usuariosTableBody');
    tablaUsuarios.innerHTML = ''; // Limpiar tabla

    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${usuario.userName}</td>
            <td>${usuario.email || 'No registrado'}</td>
            <td>${usuario.isAdmin ? 'Administrador' : 'Usuario'}</td>
            <td>
                <button onclick="editarUsuario('${usuario.id}', ${usuario.isActive})">Editar</button>
                <button onclick="eliminarUsuario('${usuario.id}')">Eliminar</button>
            </td>
        `;
        tablaUsuarios.appendChild(fila);
    });
};

// Función para eliminar usuario
const eliminarUsuario = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al eliminar usuario');

        alert('Usuario eliminado correctamente');
        await cargarUsuarios(); // Recargar la tabla
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
};

// Función para editar usuario
const editarUsuario = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual; // Alternar estado

    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ isActive: nuevoEstado })
        });

        if (!response.ok) throw new Error('Error al actualizar usuario');

        alert('Usuario actualizado correctamente');
        await cargarUsuarios(); // Recargar la tabla
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
};
