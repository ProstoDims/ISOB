import socket
import logging

HOST = "127.0.0.1"
PORT = 4445

logging.basicConfig(filename="server.log", level=logging.INFO)


def create_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen(5)
    print(f"Сервер запущен на {HOST}:{PORT}")
    return server_socket


def handle_client(client_socket, addr):
    print(f"Получен запрос от {addr[0]}:{addr[1]}")
    logging.info(f"Получен запрос от {addr[0]}:{addr[1]}")
    client_socket.send(b"Hello!\n")
    data = client_socket.recv(1024)
    print(f"Получено сообщение от {addr}: {data.decode()}")
    client_socket.close()


def run_server():
    server_socket = create_server()

    while True:
        client_socket, addr = server_socket.accept()
        print(f"Подключен клиент: {addr}")
        handle_client(client_socket, addr)


if __name__ == "__main__":
    run_server()
