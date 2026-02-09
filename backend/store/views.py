from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Sum
from .models import Product, Category, Order, OrderItem 
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer
from django.utils.text import slugify
import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

# --- PUBLIC VIEWS (No Login Required) ---

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]

# --- PRIVATE VIEWS (Login Required) ---

class MyOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return orders belonging to the CURRENT user
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    user = request.user
    data = request.data
    cart_items = data.get('cartItems')

    if not cart_items or len(cart_items) == 0:
        return Response({'detail': 'No items in cart'}, status=400)

    # 1. Create the Order
    order = Order.objects.create(user=user, total_price=0)

    # 2. Create Order Items
    total_price = 0
    for item in cart_items:
        # We need to find the product to get its price
        product = Product.objects.get(id=item['id'])
        qty = item['quantity']
        price = product.price * qty
        
        OrderItem.objects.create(
            order=order,
            product=product,
            quantity=qty,
            price=product.price
        )
        total_price += price

    # 3. Update Total Price
    order.total_price = total_price
    order.save()

    return Response(OrderSerializer(order).data)

# --- ADMIN VIEWS (Superuser Only) ---

@api_view(['GET'])
@permission_classes([IsAdminUser]) # <--- Only Admins can see this!
def admin_dashboard_stats(request):
    # 1. Total Revenue
    total_revenue = Order.objects.aggregate(Sum('total_price'))['total_price__sum'] or 0
    
    # 2. Total Orders
    total_orders = Order.objects.count()
    
    # 3. Total Products
    total_products = Product.objects.count()
    
    # 4. Recent Orders (Last 5)
    recent_orders = Order.objects.select_related('user').order_by('-created_at')[:5]
    
    recent_orders_data = []
    for order in recent_orders:
        recent_orders_data.append({
            'id': order.id,
            'user': order.user.email if order.user else "Guest",
            'total_price': order.total_price,
            'status': order.status,
            'created_at': order.created_at
        })

    return Response({
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'total_products': total_products,
        'recent_orders': recent_orders_data
    })

@api_view(['POST'])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_product(request):
    # FIX: Use .dict() instead of .copy() to avoid the "pickling" error with files
    # This converts the complex QueryDict into a simple standard Python dictionary
    try:
        data = request.data.dict()
    except AttributeError:
        # Fallback if data is already a dict (e.g. JSON request)
        data = request.data

    # 1. Auto-generate Slug
    if 'name' in data:
        data['slug'] = slugify(data['name'])
    
    # 2. Default Stock
    if 'stock' not in data or data['stock'] == '':
        data['stock'] = 10

    # 3. Manually handle the Category
    category_id = data.get('category')
    if not category_id:
        return Response({'detail': 'Category is required'}, status=400)
        
    try:
        category_instance = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return Response({'detail': 'Invalid Category ID'}, status=400)

    # 4. Create Serializer
    serializer = ProductSerializer(data=data)
    if serializer.is_valid():
        serializer.save(category=category_instance)
        return Response(serializer.data, status=201)
        
    return Response(serializer.errors, status=400)




# @api_view(['POST'])
# @permission_classes([IsAdminUser])
# @parser_classes([MultiPartParser, FormParser])
# def create_product(request):
#     data = request.data.copy()
    
#     # 1. Auto-generate Slug
#     if 'name' in data:
#         data['slug'] = slugify(data['name'])
    
#     # 2. Default Stock
#     if 'stock' not in data:
#         data['stock'] = 10

#     # 3. CRITICAL FIX: Manually handle the Category
#     category_id = data.get('category')
#     if not category_id:
#         return Response({'detail': 'Category is required'}, status=400)
        
#     try:
#         # Get the actual Category object from the DB
#         category_instance = Category.objects.get(id=category_id)
#     except Category.DoesNotExist:
#         return Response({'detail': 'Invalid Category ID'}, status=400)

#     serializer = ProductSerializer(data=data)
#     if serializer.is_valid():
#         # 4. Save with the Category object explicitly attached
#         serializer.save(category=category_instance)
#         return Response(serializer.data, status=201)
        
#     return Response(serializer.errors, status=400)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_order_status(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        order.status = request.data['status']
        order.save()
        return Response({'status': 'success', 'message': 'Order updated'})
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    try:
        user = request.user
        data = request.data
        cart_items = data.get('cartItems')
        currency = data.get('currency', 'usd').lower() # Default to USD

        if not cart_items:
            return Response({'error': 'No items'}, status=400)

        # 1. Calculate Total (Server-side calculation is safer!)
        total_amount = 0
        for item in cart_items:
            product = Product.objects.get(id=item['id'])
            total_amount += product.price * item['quantity']

        # 2. Convert to cents (Stripe expects integers: $10.00 = 1000 cents)
        # Note: INR doesn't use cents strictly, but Stripe treats it similarly (100 paise)
        amount_in_cents = int(total_amount * 100)
        
        # 3. Create Intent
        intent = stripe.PaymentIntent.create(
            amount=amount_in_cents,
            currency=currency,
            metadata={'user_id': user.id}
        )

        return Response({
            'clientSecret': intent['client_secret']
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)



# from rest_framework import generics
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from .models import Product, Category, Order, OrderItem
# from .serializers import ProductSerializer, CategorySerializer, OrderSerializer
# from rest_framework.response import Response

# class CategoryListView(generics.ListAPIView):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer
#     permission_classes = [AllowAny]

# class ProductListView(generics.ListAPIView):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer
#     permission_classes = [AllowAny]

# class ProductDetailView(generics.RetrieveAPIView):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer
#     lookup_field = 'slug'
#     permission_classes = [AllowAny]

# @api_view(['POST'])
# @permission_classes([IsAuthenticated]) # <--- Only logged in users can order
# def create_order(request):
#     user = request.user
#     data = request.data
#     cart_items = data.get('cartItems')

#     if not cart_items or len(cart_items) == 0:
#         return Response({'detail': 'No items in cart'}, status=400)

#     # 1. Create the Order first (empty total for now)
#     order = Order.objects.create(user=user, total_price=0)

#     # 2. Loop through items and create OrderItems
#     total_price = 0
#     for item in cart_items:
#         product = Product.objects.get(id=item['id'])
#         qty = item['quantity']
#         price = product.price * qty
        
#         OrderItem.objects.create(
#             order=order,
#             product=product,
#             quantity=qty,
#             price=product.price
#         )
#         total_price += price

#     # 3. Update the final total price
#     order.total_price = total_price
#     order.save()

#     return Response(OrderSerializer(order).data)

# # Add this new class
# class MyOrderListView(generics.ListAPIView):
#     serializer_class = OrderSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         # Only return orders belonging to the CURRENT user
#         return Order.objects.filter(user=self.request.user).order_by('-created_at')
