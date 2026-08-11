from django.db import models


class CarMake(models.Model):
    """Representa la marca de un vehículo, p. ej. Toyota, Audi, Kia."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=1000)

    def __str__(self):
        return str(self.name)


class CarModel(models.Model):
    """Representa un modelo de coche perteneciente a una CarMake y ligado
    a un concesionario (dealer_id se refiere a un documento en la base de
    datos Cloudant/MongoDB de concesionarios)."""

    SEDAN = 'Sedan'
    SUV = 'SUV'
    WAGON = 'Wagon'
    COUPE = 'Coupe'
    TYPE_CHOICES = [
        (SEDAN, 'Sedan'),
        (SUV, 'SUV'),
        (WAGON, 'Wagon'),
        (COUPE, 'Coupe'),
    ]

    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name='models')
    dealer_id = models.IntegerField()
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default=SUV)
    year = models.IntegerField(default=2023)

    def __str__(self):
        return f"{self.car_make.name} {self.name}"
