#include <stdio.h>
#include <string.h>

void safeFunction() {
    char buffer[16];
    int isAdmin = 0;

    printf("Введите строку: ");
    fgets(buffer, sizeof(buffer), stdin);

    printf("Вы ввели: %s\n", buffer);

    if (isAdmin) {
        printf("Доступ предоставлен! (isAdmin = %d)\n", isAdmin);
    } else {
        printf("Доступ запрещён. (isAdmin = %d)\n", isAdmin);
    }
}

int main() {
    safeFunction();
    return 0;
}
