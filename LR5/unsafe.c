#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdeprecated-declarations"
#include <stdio.h>
#include <string.h>

void unsafeFunction() {
    char buffer[16];
    int isAdmin = 0;

    printf("Введите строку: ");
    gets(buffer);

    printf("Вы ввели: %s\n", buffer);

    if (isAdmin) {
        printf("Доступ предоставлен! (isAdmin = %d)\n", isAdmin);
    } else {
        printf("Доступ запрещён. (isAdmin = %d)\n", isAdmin);
    }
}

int main() {
    unsafeFunction();
    return 0;
}
