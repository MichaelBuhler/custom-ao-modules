
#include "stddef.h"

// Declare these functions which are implemented in Rust
void free_string(const char*);
const char* process_handle (const char*, const char*);

// The main `handle()` function called by `ao-loader`
const char* handle (const char* msgJson, const char* envJson) {
    static const char* result = NULL;

    if (result != NULL) {
        // deallocate the string previously allocated by Rust
        free_string(result);
        result = NULL;
    }

    // call into Rust, receive the result
    result = process_handle(msgJson, envJson);

    return result;
}
