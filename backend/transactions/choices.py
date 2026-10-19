from django.db import models


class CustomerType(models.TextChoices):
    INDIVIDUAL = "Persona natural", "Persona natural"
    COMPANY = "Empresa", "Empresa"


class City(models.TextChoices):
    BOGOTA = "Bogotá", "Bogotá"
    MEDELLIN = "Medellín", "Medellín"
    CALI = "Cali", "Cali"
    BARRANQUILLA = "Barranquilla", "Barranquilla"
    CARTAGENA = "Cartagena", "Cartagena"
    BUCARAMANGA = "Bucaramanga", "Bucaramanga"
    PEREIRA = "Pereira", "Pereira"
    MANIZALES = "Manizales", "Manizales"
    SANTA_MARTA = "Santa Marta", "Santa Marta"
    CUCUTA = "Cúcuta", "Cúcuta"


class Category(models.TextChoices):
    SUPERMARKETS = "Supermercados", "Supermercados"
    RESTAURANTS = "Restaurantes", "Restaurantes"
    TRANSPORT = "Transporte", "Transporte"
    TECHNOLOGY = "Tecnología", "Tecnología"
    HEALTH = "Salud", "Salud"
    ENTERTAINMENT = "Entretenimiento", "Entretenimiento"
    UTILITIES = "Servicios públicos", "Servicios públicos"
    TRAVEL = "Viajes", "Viajes"
    EDUCATION = "Educación", "Educación"
    CLOTHING = "Ropa", "Ropa"


class Channel(models.TextChoices):
    CREDIT_CARD = "Tarjeta crédito", "Tarjeta crédito"
    DEBIT_CARD = "Tarjeta débito", "Tarjeta débito"
    BANK_TRANSFER = "Transferencia", "Transferencia"
    DIGITAL_WALLET = "Billetera digital", "Billetera digital"


class Status(models.TextChoices):
    APPROVED = "Aprobada", "Aprobada"
    REJECTED = "Rechazada", "Rechazada"
    PENDING = "Pendiente", "Pendiente"
    REVERSED = "Reversada", "Reversada"
