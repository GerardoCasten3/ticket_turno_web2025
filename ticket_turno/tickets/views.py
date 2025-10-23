from datetime import datetime, timedelta
import random
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse, JsonResponse
from .models import AlumnoCita, Asuntos, Cita, Estado, Municipio, NivelEducativo

# Create your views here.
@require_http_methods(["GET"])
def ticket_view(request):
    context = {}
    niveles = NivelEducativo.objects.all()
    asuntos = Asuntos.objects.all()
    estados = Estado.objects.all()

    context['niveles'] = niveles
    context['asuntos'] = asuntos
    context['estados'] = estados
    return render(request, 'form_ticket_turno.html', context)

@require_http_methods(["GET"])
def request_estado_municipios(request, estado_id):
    municipios = Municipio.objects.filter(estado_id=estado_id).values('id', 'nombre')
    municipios_list = list(municipios)
    return JsonResponse(municipios_list, safe=False)

@require_http_methods(["POST"])
def post_ticket(request):
    if request.method == "POST":
        try:
            # Tomar datos del formulario
            nivel_id = request.POST.get('level')
            estado_id = request.POST.get('state')
            municipio_id = request.POST.get('city')
            asunto_id = request.POST.get('issue')
            nombre = request.POST.get('student_name')
            apellido_paterno = request.POST.get('last_name1')
            apellido_materno = request.POST.get('last_name2')
            telefono = request.POST.get('telephone')
            celular = request.POST.get('cellphone')
            correo = request.POST.get('email')
            curp = request.POST.get('curp')
            full_name_request = request.POST.get('full_name_request')

            alumno_cita = AlumnoCita(
                nombre=nombre,
                apellido_paterno=apellido_paterno,
                apellido_materno=apellido_materno,
                curp=curp,
                telefono=telefono,
                celular=celular,
                email=correo
            )
            alumno_cita.save()

            nivel_educativo = NivelEducativo.objects.get(id=nivel_id)
            municipio = Municipio.objects.get(id=municipio_id)
            asunto = Asuntos.objects.get(id=asunto_id)
            # Fecha aleatoria para la cita
            fecha_cita = datetime.now() + timedelta(days=random.randint(1, 30))
            
            cita = Cita(
                nombre_interesado=full_name_request,
                alumno_cita=alumno_cita,
                asunto=asunto,
                municipio=municipio,
                nivel_educativo=nivel_educativo,
                fecha_cita=fecha_cita
            )
            cita.save()
            return JsonResponse({'status': 'success', 'ticket_id': cita.id}, status=200)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

@require_http_methods(["GET"])
def get_ticket(request, ticket_id):
    try:
        ticket = Cita.objects.get(id=ticket_id)
        return render(request, 'ticket_detail.html', {'ticket': ticket})
    except Cita.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Ticket not found'}, status=404)