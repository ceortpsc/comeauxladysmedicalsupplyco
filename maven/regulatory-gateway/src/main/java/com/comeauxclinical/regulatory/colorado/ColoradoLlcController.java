package com.comeauxclinical.regulatory.colorado;

import com.comeauxclinical.contracts.ColoradoLlcFilingRequest;
import com.comeauxclinical.contracts.ColoradoLlcValidationResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/business-filings/colorado/llc")
public class ColoradoLlcController {
    private final ColoradoLlcValidationService validationService;

    public ColoradoLlcController(ColoradoLlcValidationService validationService) {
        this.validationService = validationService;
    }

    @PostMapping("/validate")
    public ResponseEntity<ColoradoLlcValidationResult> validate(@RequestBody ColoradoLlcFilingRequest request) {
        ColoradoLlcValidationResult result = validationService.validate(request);
        return result.valid() ? ResponseEntity.ok(result) : ResponseEntity.unprocessableEntity().body(result);
    }
}
