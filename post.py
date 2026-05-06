import requests
import random
import time

API_URL = "http://localhost:5000/api/products"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Y2I1MTU4OTEwYjEyMTc5YjVkYjE1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3Nzc0OTIyMCwiZXhwIjoxNzc4MzU0MDIwfQ.GRjxGDjq57YIeU9WD2Jk4YDs-4QEbEkyrve81P9MpV8"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
# }

categories = ["Vases", "Lighting", "Cushions", "Rugs", "Plants", "Art"]

def generate_product(i):
    category = random.choice(categories)
    return {
        "name": f"{category} #{i}",
        "price": random.randint(50000, 1000000),
        "images": [f"https://loremflickr.com/400/400/{category.lower()}"],
        "description": f"{category} đẹp cho trang trí",
        "category": category,
        "stock": random.randint(1, 50)
    }

for i in range(1, 1001):
    res = requests.post(API_URL, json=generate_product(i), headers=headers)
    print(i, res.status_code)
    time.sleep(0.02)