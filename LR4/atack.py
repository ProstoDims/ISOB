import subprocess
import time

# Команда для подключения к серверу
command = "nc 127.0.0.1 12347"

password = "secret13\n"  # "\n" нужен для эмуляции нажатия Enter

while True:
    process = subprocess.Popen(
        command,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
    )

    try:
        process.stdin.write(password)
        process.stdin.flush()
    except Exception as e:
        print(f"Ошибка при отправке пароля: {e}")
