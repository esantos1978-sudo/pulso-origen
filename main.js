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

    // ===== BANNER DE COOKIES (CONSENT MODE V2) =====
    const CLAVE_CONSENTIMIENTO = 'pulso_origen_cookie_consent';
    let bannerCookies = null;

    // Devuelve 'accepted', 'rejected' o null si el usuario todavía no ha elegido
    function leerConsentimiento() {
        try {
            const guardado = localStorage.getItem(CLAVE_CONSENTIMIENTO);

            if (!guardado) {
                return null;
            }

            const datos = JSON.parse(guardado);

            if (datos && (datos.estado === 'accepted' || datos.estado === 'rejected')) {
                return datos.estado;
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    // Guarda la elección para no volver a mostrar el banner en próximas visitas
    function guardarConsentimiento(estado) {
        try {
            localStorage.setItem(CLAVE_CONSENTIMIENTO, JSON.stringify({
                estado: estado,
                fecha: new Date().toISOString(),
                v: 1
            }));
        } catch (error) {
            // Si localStorage no está disponible, el banner volverá a mostrarse
        }
    }

    // Informa a Google del estado de consentimiento (Consent Mode v2)
    function enviarConsentimiento(estado) {
        const valor = estado === 'accepted' ? 'granted' : 'denied';

        // Evento que escucha el contenedor de Google Tag Manager
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'consent_updated',
            'ad_storage': valor,
            'analytics_storage': valor
        });

        // Vía oficial de Google: actualiza los cuatro parámetros del Consent Mode v2
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                'ad_storage': valor,
                'ad_user_data': valor,
                'ad_personalization': valor,
                'analytics_storage': valor
            });
        }
    }

    // Construye el banner (una sola fuente de verdad para todas las páginas)
    function crearBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.id = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Aviso de cookies');
        banner.innerHTML = `
            <div class="cookie-banner-contenido">
                <p class="cookie-banner-texto">Utilizamos cookies propias y de terceros para mejorar tu experiencia y analizar el tráfico. Puedes aceptar todas o rechazar las no esenciales.</p>
                <div class="cookie-banner-acciones">
                    <a href="#" class="cookie-banner-enlace">Política de Cookies</a>
                    <button type="button" class="cookie-boton cookie-boton-rechazar" data-consentimiento="rejected">Rechazar</button>
                    <button type="button" class="cookie-boton cookie-boton-aceptar" data-consentimiento="accepted">Aceptar todas</button>
                </div>
            </div>
        `;

        banner.querySelectorAll('[data-consentimiento]').forEach(function(boton) {
            boton.addEventListener('click', function() {
                const estado = boton.getAttribute('data-consentimiento');

                guardarConsentimiento(estado);
                enviarConsentimiento(estado);
                ocultarBanner();
            });
        });

        document.body.appendChild(banner);

        return banner;
    }

    function mostrarBanner() {
        if (!bannerCookies) {
            bannerCookies = crearBanner();
        }

        // Se espera un frame para que la transición de entrada se aprecie
        requestAnimationFrame(function() {
            bannerCookies.classList.add('visible');
            document.body.classList.add('cookie-banner-abierto');
        });
    }

    function ocultarBanner() {
        if (!bannerCookies) {
            return;
        }

        bannerCookies.classList.remove('visible');
        document.body.classList.remove('cookie-banner-abierto');
    }

    const consentimientoGuardado = leerConsentimiento();

    if (consentimientoGuardado) {
        // Ya eligió antes: se reaplica su estado (el valor predeterminado es "denied")
        enviarConsentimiento(consentimientoGuardado);
    } else {
        mostrarBanner();
    }

    // Permite reabrir el banner para cambiar o retirar el consentimiento
    window.abrirBannerCookies = mostrarBanner;
});
