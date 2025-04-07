const char* process_handle (const char*, const char*);

const char* handle (const char* msgJson, const char* envJson) {
    return process_handle(msgJson, envJson);
}

int main (void) {
    return 0;
}
