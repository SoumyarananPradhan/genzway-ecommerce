from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('orders/add/', views.create_order, name='create-order'),
    path('orders/my-orders/', views.MyOrderListView.as_view(), name='my-orders'),
    path('admin/stats/', views.admin_dashboard_stats, name='admin-stats'),
    path('admin/products/add/', views.create_product, name='admin-add-product'),
    path('admin/orders/<int:pk>/update/', views.update_order_status, name='admin-order-update'),
    path('create-payment-intent/', views.create_payment_intent, name='create-payment-intent'),
]