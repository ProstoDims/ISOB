import socket
import ssl
import threading
import logging
from collections import Counter
import time

server_cert = "server.crt"
server_key = "server.key"

MAX_CONNECTIONS = 5
active_connections = 0
lock = threading.Lock()

request_counts = Counter()
blocked_ips = {}

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
    if ip in blocked_ips and time.time() - blocked_ips[ip] < 60:
        return True
    return False


def log_request(ip):
    request_counts[ip] += 1
    if request_counts[ip] > 10:
        blocked_ips[ip] = time.time()


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
            print("Слишком много подключений! Отклоняем клиента.")
            client_socket.close()
            return
        active_connections += 1

    try:
        client_socket.settimeout(5)
        client_socket.send(b"Hello!\n")
        data = client_socket.recv(1024)
        print(f"Получено сообщение от {ip}: {data.decode()}")
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
