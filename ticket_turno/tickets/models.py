from django.db import models

# Create your models here.
class Estado(models.Model):
    cve_estado = models.CharField(max_length=3)
    nombre = models.CharField(max_length=80)

    class Meta:
        verbose_name = 'Estado'
        verbose_name_plural = 'Estados'
        ordering = ['cve_estado']

    def __str__(self):
        return self.nombre
    
class Municipio(models.Model):
    cve_municipio = models.CharField(max_length=3)
    nombre = models.CharField(max_length=80)
    estado = models.ForeignKey(Estado, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Municipio'
        verbose_name_plural = 'Municipios'
        ordering = ['cve_municipio']

    def __str__(self):
        return self.nombre
    

class NivelEducativo(models.Model):
    nombre = models.CharField(max_length=80)

    class Meta:
        verbose_name = 'Nivel Educativo'
        verbose_name_plural = 'Niveles Educativos'
        ordering = ['id']

    def __str__(self):
        return self.nombre
    
class Asuntos(models.Model):
    descripcion = models.CharField(max_length=250)

    class Meta:
        verbose_name = 'Asunto'
        verbose_name_plural = 'Asuntos'
        ordering = ['id']

    def __str__(self):
        return self.descripcion

class AlumnoCita(models.Model):
    nombre = models.CharField(max_length=80)
    apellido_paterno = models.CharField(max_length=80)
    apellido_materno = models.CharField(max_length=80)
    curp = models.CharField(max_length=18)
    telefono = models.CharField(max_length=10)
    celular = models.CharField(max_length=10)
    email = models.EmailField(max_length=254)

    class Meta:
        verbose_name = 'Alumno registrado en cita'
        verbose_name_plural = 'Alumnos registrados en citas'
        ordering = ['curp']

    def __str__(self):
        return f"{self.nombre} {self.apellido_paterno} {self.apellido_materno}"
    
class Cita(models.Model):
    nombre_interesado = models.CharField(max_length=250)
    alumno_cita = models.ForeignKey(AlumnoCita, on_delete=models.CASCADE)
    asunto = models.ForeignKey(Asuntos, on_delete=models.CASCADE)
    municipio = models.ForeignKey(Municipio, on_delete=models.CASCADE)
    nivel_educativo = models.ForeignKey(NivelEducativo, on_delete=models.CASCADE)
    fecha_cita = models.DateTimeField()
    fecha_creado = models.DateTimeField(auto_now_add=True)

    class Meta: 
        verbose_name = 'Cita'
        verbose_name_plural = 'Citas'
        ordering = ['-fecha_creado']

    def __str__(self):
        return f"Cita: {self.id} Alumno: {self.alumno_cita}"
    



    