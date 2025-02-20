import socket
import ssl
import threading
import logging
from collections import Counter, deque
import time

server_cert = "server.crt"
server_key = "server.key"

MAX_CONNECTIONS = 5
active_connections = 0
lock = threading.Lock()

request_counts = Counter()
blocked_ips = {}
request_timestamps = {}
MAX_REQUESTS_PER_MIN = 15
MAX_MESSAGE_LENGTH = 1024

logging.basicConfig(filename="server.log", level=logging.INFO)


def create_secure_server(host, port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((host, port))
    server_socket.listen(MAX_CONNECTIONS)

    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile=server_cert, keyfile=server_key)

    secure_socket = context.wrap_socket(server_socket, server_side=True)
    print(f"Сервер запущен на {host}:{port}")
    return secure_socket


def is_blocked(ip):
    if ip in blocked_ips and time.time() - blocked_ips[ip] < 300:
        return True
    return False


def log_request(ip):
    now = time.time()
    if ip not in request_timestamps:
        request_timestamps[ip] = deque()

    timestamps = request_timestamps[ip]
    timestamps.append(now)

    while timestamps and now - timestamps[0] > 60:
        timestamps.popleft()

    if len(timestamps) > MAX_REQUESTS_PER_MIN:
        blocked_ips[ip] = now
        print(f"IP {ip} заблокирован за чрезмерную активность!")


def handle_client(client_socket, addr):
    global active_connections
    ip = addr[0]

    if is_blocked(ip):
        print(f"Блокируем {ip} из-за подозрительной активности!")
        client_socket.close()
        return

    log_request(ip)

    with lock:
        if active_connections >= MAX_CONNECTIONS:
            print(
                "\u0421\u043b\u0438\u0448\u043a\u043e\u043c \u043c\u043d\u043e\u0433\u043e \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0439! \u041e\u0442\u043a\u043b\u043e\u043d\u044f\u0435\u043c \u043a\u043b\u0438\u0435\u043d\u0442\u0430."
            )
            client_socket.close()
            return
        active_connections += 1

    try:
        client_socket.settimeout(5)
        client_socket.send(b"Hello!\n")
        data = client_socket.recv(MAX_MESSAGE_LENGTH)

        if not data or len(data) > MAX_MESSAGE_LENGTH:
            print(f"Обнаружена подозрительная длина сообщения от {ip}, блокируем!")
            blocked_ips[ip] = time.time()
            client_socket.close()
            return

        print(f"Получено сообщение от {ip}: {data.decode(errors='ignore')}")
    except Exception as e:
        print(f"Ошибка: {e}")
    finally:
        client_socket.close()
        with lock:
            active_connections -= 1


def run_server():
    host = "127.0.0.1"
    port = 4443
    server_socket = create_secure_server(host, port)

    while True:
        print("Ожидание клиента...")
        try:
            client_socket, addr = server_socket.accept()
            print(f"Подключен клиент: {addr}")
            logging.info(f"Подключение от {addr}")

            client_thread = threading.Thread(
                target=handle_client, args=(client_socket, addr)
            )
            client_thread.start()
        except Exception as e:
            print(f"Ошибка при подключении: {e}")


if __name__ == "__main__":
    run_server()
