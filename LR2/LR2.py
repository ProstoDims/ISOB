import os
import random
import tkinter as tk
from tkinter import filedialog


def ensure_file_exists(file_path, default_content=""):
    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(default_content)


def read_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()


def write_file(file_path, content):
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(content)


def generate_random_shift():
    return random.randint(1, 25)


def shift_cipher_encrypt(text, shift):
    encrypted = ""
    for char in text:
        if char.isalpha():
            if "a" <= char <= "z":
                base = ord("a")
                encrypted += chr((ord(char) - base + shift) % 26 + base)
            elif "а" <= char <= "я":
                base = ord("а")
                encrypted += chr((ord(char) - base + shift) % 32 + base)
            elif "A" <= char <= "Z":
                base = ord("A")
                encrypted += chr((ord(char) - base + shift) % 26 + base)
            elif "А" <= char <= "Я":
                base = ord("А")
                encrypted += chr((ord(char) - base + shift) % 32 + base)
        else:
            encrypted += chr((ord(char) + shift) % 256)
    return encrypted


def shift_cipher_decrypt(text, shift):
    return shift_cipher_encrypt(text, -shift)


def caesar_cipher_encrypt(text, shift):
    encrypted = ""
    for char in text:
        if char.isalpha():
            if "a" <= char <= "z":
                base = ord("a")
                encrypted += chr((ord(char) - base + shift) % 26 + base)
            elif "A" <= char <= "Z":
                base = ord("A")
                encrypted += chr((ord(char) - base + shift) % 26 + base)
            elif "а" <= char <= "я":
                base = ord("а")
                encrypted += chr((ord(char) - base + shift) % 32 + base)
            elif "А" <= char <= "Я":
                base = ord("А")
                encrypted += chr((ord(char) - base + shift) % 32 + base)
        else:
            encrypted += char
    return encrypted


def caesar_cipher_decrypt(text, shift):
    return caesar_cipher_encrypt(text, -shift)


def vigenere_cipher_encrypt(text, key):
    encrypted = ""
    key = key.lower()
    key_index = 0
    for char in text:
        if char.isalpha():
            if "a" <= char <= "z":
                base = ord("a")
                shift = ord(key[key_index % len(key)]) - ord("a")
                encrypted += chr((ord(char) - base + shift) % 26 + base)
            elif "а" <= char <= "я":
                base = ord("а")
                shift = ord(key[key_index % len(key)]) - ord("a")
                encrypted += chr((ord(char) - base + shift) % 32 + base)
            key_index += 1
        else:
            encrypted += char
    return encrypted


def vigenere_cipher_decrypt(text, key):
    decrypted = ""
    key = key.lower()
    key_index = 0
    for char in text:
        if char.isalpha():
            if "a" <= char <= "z":
                base = ord("a")
                shift = -(ord(key[key_index % len(key)]) - ord("a"))
                decrypted += chr((ord(char) - base + shift) % 26 + base)
            elif "а" <= char <= "я":
                base = ord("а")
                shift = -(ord(key[key_index % len(key)]) - ord("a"))
                decrypted += chr((ord(char) - base + shift) % 32 + base)
            key_index += 1
        else:
            decrypted += char
    return decrypted


def process_text(cipher_function, text, *args):
    return cipher_function(text, *args)


def save_shift(shift, file_path):
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(str(shift))


def read_shift(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return int(file.read().strip())


def choose_file(
    title="Выберите файл",
    filetypes=(("Текстовые файлы", "*.txt"), ("Все файлы", "*.*")),
):
    root = tk.Tk()
    root.withdraw()
    file_path = filedialog.askopenfilename(title=title, filetypes=filetypes)
    return file_path


def choose_save_location(default_extension=".enc", title="Сохранить файл как"):
    root = tk.Tk()
    root.withdraw()
    file_path = filedialog.asksaveasfilename(
        defaultextension=default_extension, title=title
    )
    return file_path


if __name__ == "__main__":
    file_path = choose_file()
    if not file_path:
        print("Файл не выбран. Завершение программы.")
        exit()

    text = read_file(file_path)

    print("Выберите шифр:")
    print("1. Шифр сдвига")
    print("2. Шифр Цезаря")
    print("3. Шифр Виженера")
    choice = input("Введите номер шифра: ").strip()

    if choice == "1":
        shift = generate_random_shift()
        print(f"Используем случайный сдвиг: {shift}")

        encrypted_text = process_text(shift_cipher_encrypt, text, shift)

        encrypted_file_path = choose_save_location(
            ".enc", "Сохранить зашифрованный файл"
        )
        if not encrypted_file_path:
            print("Файл для сохранения не выбран. Завершение программы.")
            exit()

        write_file(encrypted_file_path, encrypted_text)
        save_shift(shift, encrypted_file_path + ".shift")
        print(f"Зашифрованный текст сохранен в {encrypted_file_path}")

        decrypt_option = input("Хотите дешифровать данные? (да/нет): ").strip().lower()
        if decrypt_option == "да":
            saved_shift = read_shift(encrypted_file_path + ".shift")
            decrypted_text = process_text(
                shift_cipher_decrypt, encrypted_text, saved_shift
            )

            decrypted_file_path = choose_save_location(
                ".dec", "Сохранить дешифрованный файл"
            )
            if not decrypted_file_path:
                print("Файл для сохранения не выбран. Завершение программы.")
                exit()

            write_file(decrypted_file_path, decrypted_text)
            print(f"Дешифрованный текст сохранен в {decrypted_file_path}")

    elif choice == "2":
        shift = int(
            input("Введите значение сдвига для шифра Цезаря (целое число): ").strip()
        )
        encrypted_text = process_text(caesar_cipher_encrypt, text, shift)

        encrypted_file_path = choose_save_location(
            ".enc", "Сохранить зашифрованный файл"
        )
        if not encrypted_file_path:
            print("Файл для сохранения не выбран. Завершение программы.")
            exit()

        write_file(encrypted_file_path, encrypted_text)
        print(f"Зашифрованный текст сохранен в {encrypted_file_path}")

        decrypt_option = input("Хотите дешифровать данные? (да/нет): ").strip().lower()
        if decrypt_option == "да":
            decrypted_text = process_text(caesar_cipher_decrypt, encrypted_text, shift)

            decrypted_file_path = choose_save_location(
                ".dec", "Сохранить дешифрованный файл"
            )
            if not decrypted_file_path:
                print("Файл для сохранения не выбран. Завершение программы.")
                exit()

            write_file(decrypted_file_path, decrypted_text)
            print(f"Дешифрованный текст сохранен в {decrypted_file_path}")

    elif choice == "3":
        key = input("Введите ключ для шифра Виженера (только буквы): ").strip()
        encrypted_text = process_text(vigenere_cipher_encrypt, text, key)

        encrypted_file_path = choose_save_location(
            ".enc", "Сохранить зашифрованный файл"
        )
        if not encrypted_file_path:
            print("Файл для сохранения не выбран. Завершение программы.")
            exit()

        write_file(encrypted_file_path, encrypted_text)
        print(f"Зашифрованный текст сохранен в {encrypted_file_path}")

        decrypt_option = input("Хотите дешифровать данные? (да/нет): ").strip().lower()
        if decrypt_option == "да":
            decrypted_text = process_text(vigenere_cipher_decrypt, encrypted_text, key)

            decrypted_file_path = choose_save_location(
                ".dec", "Сохранить дешифрованный файл"
            )
            if not decrypted_file_path:
                print("Файл для сохранения не выбран. Завершение программы.")
                exit()

            write_file(decrypted_file_path, decrypted_text)
            print(f"Дешифрованный текст сохранен в {decrypted_file_path}")

    else:
        print("Неверный выбор. Завершение программы.")
