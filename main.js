document.addEventListener('DOMContentLoaded', function() {
    // Menú hamburguesa
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menu = document.querySelector('.menu');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navLinks.classList.toggle('show');
        });

        // Cerrar al hacer clic en un enlace
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
            });
        });

        // Cerrar si se clica fuera
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('show');
            }
        });
    }

    // Comportamiento de scroll para el menú
    if (menu) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                menu.classList.add('scrolled');
            } else {
                menu.classList.remove('scrolled');
            }
        });
    }

    // ===== FORMULARIO =====
    const formulario = document.getElementById('miFormulario');

    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            if (!nombre || !email || !mensaje) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Cambiar el botón mientras se envía
            const boton = formulario.querySelector('button[type="submit"]');
            const textoOriginal = boton.textContent;
            boton.textContent = 'Enviando...';
            boton.disabled = true;

            // Construir el cuerpo del correo con formato
            const cuerpoCorreo = `Nombre: ${nombre}%0D%0AEmail: ${email}%0D%0A%0D%0AMensaje:%0D%0A${mensaje}`;

            // Abrir el cliente de correo del usuario
            window.location.href = `mailto:hola@pulsoorigen.com?subject=Nuevo mensaje desde Pulso Origen - ${encodeURIComponent(nombre)}&body=${cuerpoCorreo}`;

            // Restaurar el botón
            boton.textContent = textoOriginal;
            boton.disabled = false;

            // Redirigir a la página de agradecimiento
            window.location.href = 'gracias.html';
        });
    }
});
