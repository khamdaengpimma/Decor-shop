import requests

BASE_URL = "http://localhost:5000/api"

# ================= CREATE USER =================
def create_user():
    print("\n=== CREATE USER ===")

    res = requests.post(f"{BASE_URL}/users", json={
        "name": "Admin",
        "email": "admin@gmail.com",
        "password": "123456",
        "role": "admin"
    })

    try:
        print(res.json())
    except:
        print("User may already exist")

# ================= LOGIN =================
def login():
    print("\n=== LOGIN ===")

    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@gmail.com",
        "password": "123456"
    })

    data = res.json()
    print(data)

    token = data.get("token")

    if not token:
        print("❌ LOGIN FAILED")
        exit()

    return token

# ================= PRODUCT CRUD =================
def test_product(token):
    print("\n=== PRODUCT CRUD ===")

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # CREATE
    res = requests.post(f"{BASE_URL}/products", json={
        "name": "Decor Lamp",
        "price": 50,
        "images": ["https://via.placeholder.com/300"],
        "description": "Nice lamp",
        "category": "light",
        "stock": 10
    }, headers=headers)

    product = res.json()
    print("CREATE:", product)

    product_id = product.get("_id")

    # GET ALL
    res = requests.get(f"{BASE_URL}/products")
    print("ALL:", res.json())

    # UPDATE
    res = requests.put(f"{BASE_URL}/products/{product_id}", json={
        "price": 99
    }, headers=headers)

    print("UPDATE:", res.json())

    # DELETE
    res = requests.delete(f"{BASE_URL}/products/{product_id}", headers=headers)
    print("DELETE:", res.json())

    return product_id

# ================= ORDER =================
def test_order(user_id):
    print("\n=== ORDER ===")

    res = requests.post(f"{BASE_URL}/orders", json={
        "userId": user_id,
        "items": [],
        "total": 100
    })

    order = res.json()
    print("CREATE:", order)

    order_id = order.get("_id")

    # UPDATE
    res = requests.put(f"{BASE_URL}/orders/{order_id}", json={
        "status": "completed"
    })

    print("UPDATE:", res.json())

    # DELETE
    res = requests.delete(f"{BASE_URL}/orders/{order_id}")
    print("DELETE:", res.json())


# ================= MAIN =================
if __name__ == "__main__":
    create_user()
    token = login()
    product_id = test_product(token)

    # get user id
    users = requests.get(f"{BASE_URL}/users").json()
    user_id = users[0]["_id"]

    test_order(user_id)