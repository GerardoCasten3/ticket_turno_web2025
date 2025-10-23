document.addEventListener("DOMContentLoaded", function() {
        // Obtener inputs, selects y botón
        const form = document.querySelector("form");
        const fullNameRequest = document.getElementById('full_name_request');
        const curp = document.getElementById('curp');
        const studentName = document.getElementById('student_name');
        const lastName1 = document.getElementById('last_name1');
        const lastName2 = document.getElementById('last_name2');
        const telephone = document.getElementById('telephone');
        const cellphone = document.getElementById('cellphone');
        const email = document.getElementById('email');
        const level = document.getElementById('level');
        const state = document.getElementById('state');
        const city = document.getElementById('city');
        const issue = document.getElementById('issue');
        const submitButton = document.querySelector("button[type='submit']");

        state.addEventListener("change", function() {
            const selectedState = this.value;
            const citySelect = document.getElementById('city');
            const selectMunicipioDiv = document.getElementById('select_municipio');

            if (selectedState) {
                const req = fetch(`/request_municipios/${selectedState}/`)
                .then(response => response.json())
                .then(data => {
                    // Limpiar opciones anteriores
                    citySelect.innerHTML = '<option value="" disabled selected>Seleccione un municipio</option>';
                    data.forEach(municipio => {
                        const option = document.createElement('option');
                        option.value = municipio.id;
                        option.textContent = municipio.nombre;
                        citySelect.appendChild(option);
                    });
                    selectMunicipioDiv.style.display = 'flex';
                });
            } else {
                citySelect.innerHTML = '<option value="" disabled selected>Seleccione un municipio</option>';
                selectMunicipioDiv.style.display = 'none';
            }
        });

        submitButton.addEventListener("click", async function(event) {
            // Validar campos
            let isValid = true;
            let errorMessage = "";

            if (!validateFullNameRequest()) {
                isValid = false;
                errorMessage += "-El nombre completo del solicitante debe tener entre 3 y 80 caracteres y solo contener letras y espacios.<br>";
            }

            if (!validateCURP()) {
                isValid = false;
                errorMessage += "-El CURP no es válido. Debe seguir el formato correcto.<br>Ejemplo: ABCD123456HDFRRL09<br>";
            }

            if (!validateStudentName()) {
                isValid = false;
                errorMessage += "-El nombre del estudiante debe tener entre 3 y 50 caracteres y solo contener letras y espacios.<br>";
            }

            if (!validateLastName1()) {
                isValid = false;
                errorMessage += "-El primer apellido debe tener entre 3 y 30 caracteres y solo contener letras y espacios.<br>";
            }

            if (!validateLastName2()) {
                isValid = false;
                errorMessage += "-El segundo apellido debe tener entre 3 y 30 caracteres y solo contener letras y espacios.<br>";
            }

            if (!validateTelephone()) {
                isValid = false;
                errorMessage += "-El teléfono debe contener exactamente 10 dígitos.<br>";
            }

            if (!validateCellphone()) {
                isValid = false;
                errorMessage += "-El celular debe contener exactamente 10 dígitos.<br>";
            }

            if (!validateEmail()) {
                isValid = false;
                errorMessage += "-El correo electrónico no es válido.<br>Ejemplo: usuario@ejemplo.com<br>";
            }

            if (level.value === "") {
                isValid = false;
                errorMessage += "-Debe seleccionar un nivel de estudios.<br>";
            }

            if (state.value === "") {
                isValid = false;
                errorMessage += "-Debe seleccionar un estado.<br>";
            }

            if (city.value === "") {
                isValid = false;
                errorMessage += "-Debe seleccionar un municipio.<br>";
            }

            if (issue.value === "") {
                isValid = false;
                errorMessage += "-Debe seleccionar un motivo de solicitud.<br>";
            }

            if (!isValid) {
                event.preventDefault();
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el formulario',
                    html: errorMessage,
                    confirmButtonText: 'Corregir'
                });
            }

            if (isValid) {
                event.preventDefault(); // Evitar el envío real del formulario para demostración
                const formData = new FormData(document.querySelector('form'));
                const req = await fetch('/post_ticket/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                    },
                    body: formData
                });
                if (!req.ok) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al enviar el formulario',
                        text: 'Hubo un problema al enviar el formulario. Por favor, inténtelo de nuevo.',
                        confirmButtonText: 'Aceptar'
                    });
                    return;
                }
                const result = await Swal.fire({
                    icon: 'success',
                    title: 'Formulario válido',
                    text: 'El formulario se ha enviado correctamente.',
                    confirmButtonText: 'Ir al detalle del ticket'
                });
                if (result.isConfirmed){
                    // Enviar a los detalles del ticket
                    const responseData = await req.json();
                    const ticketId = responseData.ticket_id;
                    window.location.href = `/get_ticket/${ticketId}/`;
                }
            }
        });
});

function validateFullNameRequest() {
    const fullNameRequest = document.getElementById('full_name_request');
    const regex = /^[a-zA-ZÀ-ÿ\s]{3,80}$/;
    return regex.test(fullNameRequest.value);
}

function validateCURP() {
    const curp = document.getElementById('curp');
    const regex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
    return regex.test(curp.value);
}

function validateStudentName() {
    const studentName = document.getElementById('student_name');
    const regex = /^[a-zA-ZÀ-ÿ\s]{3,50}$/;
    return regex.test(studentName.value);
}

function validateLastName1() {
    const lastName1 = document.getElementById('last_name1');
    const regex = /^[a-zA-ZÀ-ÿ\s]{3,30}$/;
    return regex.test(lastName1.value);
}

function validateLastName2() {
    const lastName2 = document.getElementById('last_name2');
    const regex = /^[a-zA-ZÀ-ÿ\s]{3,30}$/;
    return regex.test(lastName2.value);
}

function validateTelephone() {
    const telephone = document.getElementById('telephone');
    const regex = /^\d{10}$/;
    return regex.test(telephone.value);
}

function validateCellphone() {
    const cellphone = document.getElementById('cellphone');
    const regex = /^\d{10}$/;
    return regex.test(cellphone.value);
}

function validateEmail() {
    const email = document.getElementById('email');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.value);
}

