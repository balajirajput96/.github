import requests

url = "http://localhost:8000"
data = {"features": [5.1, 3.5, 1.4, 0.2]}

print(requests.get(f"{url}/health").json())
print(requests.post(f"{url}/predict", json=data).json())