from rest_framework.routers import DefaultRouter

from .views import MetricsViewSet, TransactionViewSet

router = DefaultRouter()
router.register("transactions", TransactionViewSet, basename="transaction")
router.register("metrics", MetricsViewSet, basename="metrics")

urlpatterns = router.urls
