from django.db import models
from django.db.models import Q

from .choices import Category, Channel, City, CustomerType, Status


class Customer(models.Model):
    customer_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=120)
    customer_type = models.CharField(max_length=20, choices=CustomerType.choices)
    city = models.CharField(max_length=30, choices=City.choices, db_index=True)

    class Meta:
        ordering = ["customer_id"]

    def __str__(self):
        return f"{self.customer_id} - {self.name}"


class Merchant(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=30, choices=Category.choices, db_index=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Transaction(models.Model):
    transaction_id = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(db_index=True)
    customer = models.ForeignKey(
        Customer, on_delete=models.PROTECT, related_name="transactions"
    )
    merchant = models.ForeignKey(
        Merchant, on_delete=models.PROTECT, related_name="transactions"
    )
    channel = models.CharField(max_length=20, choices=Channel.choices, db_index=True)
    amount = models.PositiveBigIntegerField(db_index=True)
    currency = models.CharField(max_length=3, default="COP")
    installments = models.PositiveSmallIntegerField(default=1)
    status = models.CharField(max_length=10, choices=Status.choices)

    class Meta:
        ordering = ["-created_at", "-id"]
        indexes = [
            models.Index(
                fields=["status", "created_at"], name="txn_status_created_idx"
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=Q(amount__gt=0),
                name="txn_amount_positive",
            ),
            models.CheckConstraint(
                condition=Q(installments__gte=1, installments__lte=36),
                name="txn_installments_range",
            ),
            models.CheckConstraint(
                condition=Q(installments=1) | Q(channel=Channel.CREDIT_CARD),
                name="txn_installments_only_credit",
            ),
        ]

    def __str__(self):
        return self.transaction_id
