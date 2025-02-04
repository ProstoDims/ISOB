import os

def ensure_file_exists(file_path, default_content=""):
    if not os.path.exists(file_path):
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(default_content)

def read_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def write_file(file_path, content):
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

# Шифр сдвига (можно шифровать любые символы)
def shift_cipher_encrypt(text, shift):
    encrypted = ""
    for char in text:
        if char.isalpha():
            if 'a' <= char <= 'z':
                base = ord('a')
                encrypted += chr((ord(char) - base + shift) % 26 + base)
            elif 'а' <= char <= 'я':
                base = ord('а')
                encrypted += chr((ord(char) - base + shift) % 32 + base)
            elif 'A' <= char <= 'Z':
                base = ord('A')
                encrypted += chr((ord(char) - base + shift) % 26 + base)
            elif 'А' <= char <= 'Я':
                base = ord('А')
                encrypted += chr((ord(char) - base + shift) % 32 + base)
        else:
            encrypted += chr((ord(char) + shift) % 256)  # Для других символов
    return encrypted

def shift_cipher_decrypt(text, shift):
    return shift_cipher_encrypt(text, -shift)

# Шифр Цезаря (работает только с буквами)
def caesar_cipher_encrypt(text, shift):
    encrypted = ""
    for char in text:
        if char.isalpha():
            if 'a' <= char <= 'z':
                base = ord('a')
                encrypted += chr((ord(char) - base + shift) % 26 + base)
            elif 'A' <= char <= 'Z':
                base = ord('A')
                encrypted += chr((ord(char) - base + shift) % 26 + base)
            elif 'а' <= char <= 'я':
                base = ord('а')
                encrypted += chr((ord(char) - base + shift) % 32 + base)
            elif 'А' <= char <= 'Я':
                base = ord('А')
                encrypted += chr((ord(char) - base + shift) % 32 + base)
        else:
            encrypted += char  # Остальные символы остаются неизменными
    return encrypted

def caesar_cipher_decrypt(text, shift):
    return caesar_cipher_encrypt(text, -shift)

# Шифр Виженера (работает только с буквами)
def vigenere_cipher_encrypt(text, key):
    encrypted = ""
    key = key.lower()
    key_index = 0
    for char in text:
        if char.isalpha():
            if 'a' <= char <= 'z':
                base = ord('a')
                shift = ord(key[key_index % len(key)]) - ord('a')
                encrypted += chr((ord(char) - base + shift) % 26 + base)
            elif 'а' <= char <= 'я':
                base = ord('а')
                shift = ord(key[key_index % len(key)]) - ord('a')
                encrypted += chr((ord(char) - base + shift) % 32 + base)
            key_index += 1
        else:
            encrypted += char  # Остальные символы остаются неизменными
    return encrypted

def vigenere_cipher_decrypt(text, key):
    decrypted = ""
    key = key.lower()
    key_index = 0
    for char in text:
        if char.isalpha():
            if 'a' <= char <= 'z':
                base = ord('a')
                shift = -(ord(key[key_index % len(key)]) - ord('a'))
                decrypted += chr((ord(char) - base + shift) % 26 + base)
            elif 'а' <= char <= 'я':
                base = ord('а')
                shift = -(ord(key[key_index % len(key)]) - ord('a'))
                decrypted += chr((ord(char) - base + shift) % 32 + base)
            key_index += 1
        else:
            decrypted += char  # Остальные символы остаются неизменными
    return decrypted

def process_text(cipher_function, text, *args):
    return cipher_function(text, *args)

if __name__ == "__main__":
    file_path = input("Введите путь к файлу: ").strip()
    ensure_file_exists(file_path)
    text = read_file(file_path)
    
    print("Выберите шифр:")
    print("1. Шифр сдвига")
    print("2. Шифр Цезаря")
    print("3. Шифр Виженера")
    choice = input("Введите номер шифра: ").strip()
    
    if choice == "1":
        shift = int(input("Введите значение сдвига (целое число): ").strip())
        encrypted_text = process_text(shift_cipher_encrypt, text, shift)
        write_file(file_path + ".enc", encrypted_text)
        print(f"Зашифрованный текст сохранен в {file_path}.enc")
        
        decrypt_option = input("Хотите дешифровать данные? (да/нет): ").strip().lower()
        if decrypt_option == "да":
            decrypted_text = process_text(shift_cipher_decrypt, encrypted_text, shift)
            write_file(file_path + ".dec", decrypted_text)
            print(f"Дешифрованный текст сохранен в {file_path}.dec")

    elif choice == "2":
        shift = int(input("Введите значение сдвига для шифра Цезаря (целое число): ").strip())
        encrypted_text = process_text(caesar_cipher_encrypt, text, shift)
        write_file(file_path + ".enc", encrypted_text)
        print(f"Зашифрованный текст сохранен в {file_path}.enc")
        
        decrypt_option = input("Хотите дешифровать данные? (да/нет): ").strip().lower()
        if decrypt_option == "да":
            decrypted_text = process_text(caesar_cipher_decrypt, encrypted_text, shift)
            write_file(file_path + ".dec", decrypted_text)
            print(f"Дешифрованный текст сохранен в {file_path}.dec")

    elif choice == "3":
        key = input("Введите ключ для шифра Виженера (только буквы): ").strip()
        encrypted_text = process_text(vigenere_cipher_encrypt, text, key)
        write_file(file_path + ".enc", encrypted_text)
        print(f"Зашифрованный текст сохранен в {file_path}.enc")
        
        decrypt_option = input("Хотите дешифровать данные? (да/нет): ").strip().lower()
        if decrypt_option == "да":
            decrypted_text = process_text(vigenere_cipher_decrypt, encrypted_text, key)
            write_file(file_path + ".dec", decrypted_text)
            print(f"Дешифрованный текст сохранен в {file_path}.dec")

    else:
        print("Неверный выбор. Завершение программы.")
