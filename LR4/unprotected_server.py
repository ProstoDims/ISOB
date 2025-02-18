import socket


def create_unsecure_server(host, port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(5)

    print(f"Сервер запущен на {host}:{port}")
    return server_socket


def handle_client(client_socket):
    client_socket.send(b"Hello!\n")
    data = client_socket.recv(1024)
    print(f"Получено сообщение: {data.decode()}")
    client_socket.close()


def run_server():
    host = "127.0.0.1"
    port = 4445

    server_socket = create_unsecure_server(host, port)

    while True:
        print("Ожидание клиента...")
        client_socket, addr = server_socket.accept()
        print(f"Подключен клиент: {addr}")
        handle_client(client_socket)


if __name__ == "__main__":
    run_server()
