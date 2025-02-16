document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken');
    const dashboardContent = document.getElementById('dashboardContent');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!authToken) {
        window.location.href = 'login.html';
        return;
    }

    // Decodificar el token JWT
    const decodeToken = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            return null;
        }
    };

    // Cargar contenido según rol
    const loadDashboard = async () => {
        const userData = decodeToken(authToken);
        
        if (!userData) {
            window.location.href = 'login.html';
            return;
        }

        if (userData.role === 'ADMIN') {
            try {
                const response = await fetch(`${API_URL}/users`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                
                const users = await response.json();
                dashboardContent.innerHTML = `
                    <h1>Bienvenido ADMIN</h1>
                    <h3>Usuarios registrados:</h3>
                    <ul class="user-list">
                        ${users.map(user => `
                            <li>${user.username} - ${user.role}</li>
                        `).join('')}
                    </ul>
                `;
            } catch (error) {
                dashboardContent.innerHTML = '<p>Error al cargar usuarios</p>';
            }
        } else {
            dashboardContent.innerHTML = '<h1>¡Felicidades USER, hiciste login!</h1>';
        }
    };

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });

    loadDashboard();
});