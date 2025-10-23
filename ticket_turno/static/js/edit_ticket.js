document.addEventListener("DOMContentLoaded", function() {
    // Obtener elementos del formulario
    const state = document.getElementById('state');
    const city = document.getElementById('city');
    const selectMunicipioDiv = document.getElementById('select_municipio');
    const form = document.querySelector("form");

    // Mostrar el select de municipio si ya hay uno seleccionado
    if (city.value) {
        selectMunicipioDiv.style.display = 'flex';
    }

    // Manejar cambio de estado
    state.addEventListener("change", function() {
        const selectedState = this.value;
        const citySelect = document.getElementById('city');

        if (selectedState) {
            fetch(`/request_municipios/${selectedState}/`)
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
            })
            .catch(error => {
                console.error('Error al cargar municipios:', error);
            });
        } else {
            citySelect.innerHTML = '<option value="" disabled selected>Seleccione un municipio</option>';
            selectMunicipioDiv.style.display = 'none';
        }
    });

    // Manejar envío del formulario
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Validar campos requeridos
        const requiredFields = [
            'full_name_request', 'curp', 'student_name', 'last_name1', 
            'last_name2', 'telephone', 'cellphone', 'email', 'level', 
            'state', 'city', 'issue'
        ];
        
        let isValid = true;
        let missingFields = [];

        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field.value.trim()) {
                isValid = false;
                missingFields.push(field.previousElementSibling.textContent);
                field.style.borderColor = 'red';
            } else {
                field.style.borderColor = '#ccc';
            }
        });

        if (!isValid) {
            alert('Por favor complete todos los campos obligatorios:\n' + missingFields.join('\n'));
            return;
        }

        // Validaciones adicionales
        if (!validateCURP()) {
            alert('El CURP debe tener exactamente 18 caracteres');
            return;
        }

        if (!validatePhone('telephone') || !validatePhone('cellphone')) {
            alert('Los números de teléfono deben tener exactamente 10 dígitos');
            return;
        }

        if (!validateEmail()) {
            alert('Por favor ingrese un correo electrónico válido');
            return;
        }

        // Si todas las validaciones pasan, enviar el formulario
        this.submit();
    });

    // Funciones de validación
    function validateCURP() {
        const curp = document.getElementById('curp').value;
        return curp.length === 18;
    }

    function validatePhone(fieldId) {
        const phone = document.getElementById(fieldId).value;
        return phone.length === 10 && /^\d+$/.test(phone);
    }

    function validateEmail() {
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Limitar entrada de caracteres en campos numéricos
    document.getElementById('telephone').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').substring(0, 10);
    });

    document.getElementById('cellphone').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').substring(0, 10);
    });

    document.getElementById('curp').addEventListener('input', function(e) {
        this.value = this.value.toUpperCase().substring(0, 18);
    });
});
