import socket

while True:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(("127.0.0.1", 4445))
        s.sendall(b"Test message\n")
        response = s.recv(1024)
        print(f"Сервер ответил: {response.decode()}")
        s.close()
    except Exception as e:
        print(f"Ошибка: {e}")
