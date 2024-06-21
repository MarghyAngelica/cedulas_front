var main = () => {
    alertify.set('notifier', 'delay', 30);
    alertify.set('notifier', 'position', 'top-right');
    if ($('#selectAmbiente').val() == "produccion")
        ambiente = "produccion"
    events();
};
var _idFile;
var events = () => {
    var b641
    var b642
    $("#btnSeleccionarArchivo").click(() => {
        $("#archivo1").click();
    });
    $("#btnSeleccionarArchivo2").click(() => {
        $("#archivo2").click();
    });
    $("#archivo1").change((e) => {
        $("#fileName").html(e.target.value);
        var file = document.getElementById("archivo1").files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                b641 = reader.result
                var html = '<img class="mb-4" src="' + b641 + '" alt="Red dot" style="width:500px; height:250px;"/>'
                $('#imgB64').html(html)

            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
    });

    $("#archivo2").change((e) => {
        $("#fileName2").html(e.target.value);
        file = document.getElementById("archivo2").files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                b642 = reader.result
                var html = '<img class="mb-4" src="' + b642 + '" alt="Red dot" style="width:500px; height:250px;"/>'
                $('#imgB642').html(html)

            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
    });
    $("#btnNuevaFirmaCarga2").click(() => {
        var senData = {
            ext: "image",
            back: b642,
            front: b641
        }
        ajax("ccDigital", senData, function (respuesta) {
            if (!respuesta.success) {
                alertify.error(respuesta.mensaje)
                return
            }
            var oResp = JSON.parse(respuesta.data).data
            var sResp

            if(oResp.TIPO == 'Cedula Antigua'){
                sResp = '<h5>'
                sResp += 'CEDULA ANTIGUA'
                sResp += '<br>'
                sResp += '<br>'
                sResp += 'Numero: ' + oResp.documento
                sResp += '<br>'
                sResp += 'Primer Nombre: ' + oResp.nombre_1
                sResp += '<br>'
                sResp += 'Segundo Nombre: ' + oResp.nombre_2
                sResp += '<br>'
                sResp += 'Primer Apellido: ' + oResp.apellido_1
                sResp += '<br>'
                sResp += 'Segundo Apellido: ' + oResp.apellido_2
                sResp += '<br>'
                sResp += 'Sexo: ' + oResp.sexo
                sResp += '<br>'
                sResp += 'Fecha de Nacimiento: ' + oResp.fecha_nacimiento
                sResp += '<br>'
                sResp += 'Municipio: ' + oResp.municipio
                sResp += '<br>'
                sResp += 'Rh: ' + oResp.rh
                sResp += '<br>'               
                sResp += '</h5>'
            } else if (oResp.TIPO == 'Cedula Digital'){
                sResp = '<h5>'
                sResp += 'CEDULA DIGITAL'
                sResp += '<br>'
                sResp += '<br>'
                sResp += 'Numero: ' + oResp.Numero
                sResp += '<br>'
                sResp += 'Nombres: ' + oResp.Nombres
                sResp += '<br>'
                sResp += 'Apellidos: ' + oResp.Apellidos
                sResp += '<br>'
                sResp += 'Fecha de Nacimiento: ' + oResp.FechaNacimiento
                sResp += '<br>'
                sResp += 'Sexo: ' + oResp.sexo               
                sResp += '</h5>'
            } else {
                sResp = '<h5>'
                sResp += oResp                              
                sResp += '</h5>'
            }

            // var sResp = '<h5>'
            // var sOResp = JSON.stringify(oResp)
            // console.log('string::: ', JSON.stringify(oResp))
            // console.log('oResp.length::: ', oResp.length)
            // var replaceString = sOResp.replace(/[\r\n."{}]/gm, " ")
            // var replaceString2 = replaceString.replace(/[\r,."{}]/gm, "<br>")
            // console.log('replace::: ', replaceString)
            // sResp += replaceString2
            // sResp += '</h5>'

            
            console.log('sResp::: ', sResp)

            $("#infoDiv").html(sResp)
            alertify.success('Carga de información completa');

        });

    });
}
$(document).ready(main);