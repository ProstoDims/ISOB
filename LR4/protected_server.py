import socket
import ssl

server_cert = "server.crt"
server_key = "server.key"


def create_secure_server(host, port):
    # Создаём обычный TCP-сокет
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(5)

    # Создаём контекст SSL
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile=server_cert, keyfile=server_key)

    # Оборачиваем сокет в защищённый SSL-сервер
    secure_socket = context.wrap_socket(server_socket, server_side=True)

    print(f"Сервер запущен на {host}:{port}")
    return secure_socket


def handle_client(client_socket):
    client_socket.send(b"Hello!\n")  # Сделали строку байтовой
    data = client_socket.recv(1024)
    print(f"Получено сообщение: {data.decode()}")
    client_socket.close()


def run_server():
    host = "127.0.0.1"
    port = 4443

    server_socket = create_secure_server(host, port)

    while True:
        print("Ожидание клиента...")
        client_socket, addr = server_socket.accept()
        print(f"Подключен клиент: {addr}")
        handle_client(client_socket)


if __name__ == "__main__":
    run_server()
