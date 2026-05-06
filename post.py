import requests
import time
import random

API_URL = "http://localhost:5000/api/products"

TOKEN = "YOUR_JWT_TOKEN"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# 30 sản phẩm thật ngoài đời
products = [
    {
        "name": "Đèn bàn IKEA TERTIAL",
        "price": 790000,
        "images": ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"],
        "description": "Đèn bàn thiết kế tối giản phong cách Bắc Âu.",
        "category": "Đèn trang trí",
        "stock": 25
    },
    {
        "name": "Ghế IKEA POÄNG",
        "price": 3490000,
        "images": ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"],
        "description": "Ghế thư giãn nổi tiếng của IKEA.",
        "category": "Nội thất",
        "stock": 10
    },
    {
        "name": "Đồng hồ treo tường Seiko",
        "price": 1250000,
        "images": ["https://images.unsplash.com/photo-1501139083538-0139583c060f"],
        "description": "Đồng hồ treo tường cao cấp thương hiệu Seiko.",
        "category": "Trang trí",
        "stock": 15
    },
    {
        "name": "Bình giữ nhiệt Lock&Lock",
        "price": 450000,
        "images": ["https://images.unsplash.com/photo-1524758631624-e2822e304c36"],
        "description": "Bình giữ nhiệt inox dung tích 500ml.",
        "category": "Gia dụng",
        "stock": 40
    },
    {
        "name": "Máy lọc không khí Xiaomi",
        "price": 3290000,
        "images": ["https://images.unsplash.com/photo-1513694203232-719a280e022f"],
        "description": "Máy lọc không khí thông minh Xiaomi.",
        "category": "Điện tử",
        "stock": 12
    },
    {
        "name": "Nồi chiên không dầu Philips",
        "price": 4590000,
        "images": ["https://images.unsplash.com/photo-1585515656973-94f3f57b7f3b"],
        "description": "Nồi chiên không dầu Philips dung tích lớn.",
        "category": "Gia dụng",
        "stock": 18
    },
    {
        "name": "Máy pha cà phê Delonghi",
        "price": 6990000,
        "images": ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"],
        "description": "Máy pha cà phê espresso chuyên nghiệp.",
        "category": "Gia dụng",
        "stock": 7
    },
    {
        "name": "Loa Bluetooth JBL Flip 6",
        "price": 2890000,
        "images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e"],
        "description": "Loa Bluetooth chống nước âm thanh mạnh mẽ.",
        "category": "Điện tử",
        "stock": 20
    },
    {
        "name": "Tai nghe Sony WH-1000XM5",
        "price": 8990000,
        "images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e"],
        "description": "Tai nghe chống ồn cao cấp của Sony.",
        "category": "Điện tử",
        "stock": 8
    },
    {
        "name": "Apple AirPods Pro 2",
        "price": 6490000,
        "images": ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434"],
        "description": "Tai nghe không dây chống ồn Apple.",
        "category": "Điện tử",
        "stock": 22
    },
    {
        "name": "Samsung Smart TV 55 inch",
        "price": 13990000,
        "images": ["https://images.unsplash.com/photo-1593784991095-a205069470b6"],
        "description": "Smart TV Samsung 4K UHD.",
        "category": "Điện tử",
        "stock": 6
    },
    {
        "name": "Máy hút bụi Dyson V15",
        "price": 16990000,
        "images": ["https://images.unsplash.com/photo-1581578731548-c64695cc6952"],
        "description": "Máy hút bụi không dây Dyson.",
        "category": "Gia dụng",
        "stock": 5
    },
    {
        "name": "Bàn IKEA LINNMON",
        "price": 2190000,
        "images": ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"],
        "description": "Bàn làm việc hiện đại phong cách tối giản.",
        "category": "Nội thất",
        "stock": 14
    },
    {
        "name": "Ghế gaming DXRacer",
        "price": 7990000,
        "images": ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd"],
        "description": "Ghế gaming cao cấp cho streamer.",
        "category": "Nội thất",
        "stock": 9
    },
    {
        "name": "Laptop MacBook Air M2",
        "price": 28990000,
        "images": ["https://images.unsplash.com/photo-1517336714739-489689fd1ca8"],
        "description": "Laptop Apple chip M2 siêu mỏng nhẹ.",
        "category": "Laptop",
        "stock": 11
    },
    {
        "name": "iPhone 15 Pro Max",
        "price": 33990000,
        "images": ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"],
        "description": "Điện thoại flagship Apple.",
        "category": "Điện thoại",
        "stock": 13
    },
    {
        "name": "Samsung Galaxy S24 Ultra",
        "price": 31990000,
        "images": ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"],
        "description": "Điện thoại Samsung cao cấp.",
        "category": "Điện thoại",
        "stock": 12
    },
    {
        "name": "Nintendo Switch OLED",
        "price": 8990000,
        "images": ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3"],
        "description": "Máy chơi game Nintendo Switch OLED.",
        "category": "Gaming",
        "stock": 16
    },
    {
        "name": "PlayStation 5",
        "price": 14990000,
        "images": ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db"],
        "description": "Máy chơi game Sony PS5.",
        "category": "Gaming",
        "stock": 8
    },
    {
        "name": "Xbox Series X",
        "price": 13990000,
        "images": ["https://images.unsplash.com/photo-1621259182978-fbf93132d53d"],
        "description": "Máy chơi game Xbox mạnh mẽ.",
        "category": "Gaming",
        "stock": 7
    },
    {
        "name": "Chuột Logitech G Pro X Superlight",
        "price": 3290000,
        "images": ["https://images.unsplash.com/photo-1527814050087-3793815479db"],
        "description": "Chuột gaming siêu nhẹ.",
        "category": "Gaming Gear",
        "stock": 19
    },
    {
        "name": "Bàn phím Keychron K2",
        "price": 2490000,
        "images": ["https://images.unsplash.com/photo-1515879218367-8466d910aaa4"],
        "description": "Bàn phím cơ không dây hot nhất.",
        "category": "Gaming Gear",
        "stock": 20
    },
    {
        "name": "Màn hình LG UltraWide 34 inch",
        "price": 10990000,
        "images": ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf"],
        "description": "Màn hình cong UltraWide LG.",
        "category": "Điện tử",
        "stock": 6
    },
    {
        "name": "Camera Fujifilm X-T5",
        "price": 42990000,
        "images": ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32"],
        "description": "Máy ảnh mirrorless Fujifilm.",
        "category": "Camera",
        "stock": 4
    },
    {
        "name": "Canon EOS R6 Mark II",
        "price": 58990000,
        "images": ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32"],
        "description": "Máy ảnh full-frame Canon.",
        "category": "Camera",
        "stock": 3
    },
    {
        "name": "Apple Watch Series 9",
        "price": 11990000,
        "images": ["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d"],
        "description": "Đồng hồ thông minh Apple.",
        "category": "Wearable",
        "stock": 14
    },
    {
        "name": "Robot hút bụi Roborock S8",
        "price": 12990000,
        "images": ["https://images.unsplash.com/photo-1581578731548-c64695cc6952"],
        "description": "Robot hút bụi lau nhà thông minh.",
        "category": "Gia dụng",
        "stock": 10
    },
    {
        "name": "Máy sấy tóc Dyson Supersonic",
        "price": 11990000,
        "images": ["https://images.unsplash.com/photo-1522338140262-f46f5913618a"],
        "description": "Máy sấy tóc cao cấp Dyson.",
        "category": "Làm đẹp",
        "stock": 9
    },
    {
        "name": "Tủ lạnh Samsung Inverter",
        "price": 18990000,
        "images": ["https://images.unsplash.com/photo-1584568694244-14fbdf83bd30"],
        "description": "Tủ lạnh tiết kiệm điện Samsung.",
        "category": "Gia dụng",
        "stock": 5
    },
    {
        "name": "Máy giặt LG AI DD",
        "price": 13990000,
        "images": ["https://images.unsplash.com/photo-1626806787461-102c1bfaaea1"],
        "description": "Máy giặt AI thông minh LG.",
        "category": "Gia dụng",
        "stock": 6
    }
]
#ok
# Insert products
for i, product in enumerate(products, start=1):
    try:
        res = requests.post(API_URL, json=product, headers=headers)
        print(f"{i}. {product['name']} -> {res.status_code}")
    except Exception as e:
        print(f"Error: {e}")

    time.sleep(0.05)

print("Done inserting 30 real products!")