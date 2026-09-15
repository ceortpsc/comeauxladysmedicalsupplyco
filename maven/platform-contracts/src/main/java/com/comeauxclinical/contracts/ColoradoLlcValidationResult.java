package com.comeauxclinical.contracts;

import java.util.List;

public record ColoradoLlcValidationResult(
        boolean valid,
        List<String> errors,
        String submissionMode
) {
    public ColoradoLlcValidationResult {
        errors = errors == null ? List.of() : List.copyOf(errors);
    }
}
