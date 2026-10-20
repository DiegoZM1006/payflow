from datetime import datetime
from itertools import count
from zoneinfo import ZoneInfo

from transactions.choices import Category, Channel, City, CustomerType, Status
from transactions.models import Customer, Merchant, Transaction

BOGOTA = ZoneInfo("America/Bogota")
_sequence = count(1)


def local_datetime(year, month, day, hour=12, minute=0):
    return datetime(year, month, day, hour, minute, tzinfo=BOGOTA)


def create_customer(**overrides):
    number = next(_sequence)
    fields = {
        "customer_id": f"CUS-{number:04d}",
        "name": f"Customer {number}",
        "customer_type": CustomerType.INDIVIDUAL,
        "city": City.BOGOTA,
    }
    return Customer.objects.create(**(fields | overrides))


def create_merchant(**overrides):
    number = next(_sequence)
    fields = {"name": f"Merchant {number}", "category": Category.CLOTHING}
    return Merchant.objects.create(**(fields | overrides))


def create_transaction(customer, merchant, **overrides):
    number = next(_sequence)
    fields = {
        "transaction_id": f"TXN-{number:06d}",
        "created_at": local_datetime(2025, 10, 1),
        "customer": customer,
        "merchant": merchant,
        "channel": Channel.DEBIT_CARD,
        "amount": 50_000,
        "installments": 1,
        "status": Status.APPROVED,
    }
    return Transaction.objects.create(**(fields | overrides))
