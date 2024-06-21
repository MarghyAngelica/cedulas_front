var main = () => {
    alertify.set('notifier', 'position', 'top-right');
    events();
};

var events = () => {
    $("#ingresar").click(() => {
        iniciarSesion();
    });
}

function iniciarSesion() {
    const usuario = $("#usuario").val().trim();
    const pass = $("#password").val().trim();

    if (usuario === "") {
        alertify.error("El usuario es requerido")
        return;
    }

    if (pass === "") {
        alertify.error("La contraseña es requerida")
        return;
    }

    const data = { usuario, pass }
    ajax("login", data, function (respuesta) {
        if (respuesta.success) {
            window.location.href =`${respuesta.redirect}?q=${encodeURIComponent(respuesta.token)}`
        }   
    });
}

$(document).ready(main);