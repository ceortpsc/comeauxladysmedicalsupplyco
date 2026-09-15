package com.comeauxclinical.regulatory.colorado;

import com.comeauxclinical.contracts.ColoradoLlcFilingRequest;
import com.comeauxclinical.contracts.ColoradoLlcValidationResult;
import com.comeauxclinical.contracts.RegisteredAgentType;
import com.comeauxclinical.contracts.RegisteredAgentVerificationMethod;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ColoradoLlcValidationService {
    public ColoradoLlcValidationResult validate(ColoradoLlcFilingRequest request) {
        List<String> errors = new ArrayList<>();
        if (request == null) {
            return new ColoradoLlcValidationResult(false, List.of("Request is required."), "assisted_official_handoff");
        }

        require(errors, request.legalName(), "Legal LLC name is required.");
        require(errors, request.principalStreet(), "Principal office street is required.");
        require(errors, request.principalCity(), "Principal office city is required.");
        require(errors, request.principalState(), "Principal office state is required.");
        require(errors, request.principalPostalCode(), "Principal office postal code is required.");
        require(errors, request.registeredAgentName(), "Registered agent name is required.");
        require(errors, request.registeredAgentStreet(), "Registered agent street is required.");
        require(errors, request.registeredAgentCity(), "Registered agent city is required.");
        require(errors, request.registeredAgentPostalCode(), "Registered agent postal code is required.");
        require(errors, request.organizerName(), "Organizer name is required.");

        if (request.legalName() != null && !hasLlcDesignator(request.legalName())) {
            errors.add("Legal name should include an LLC designator; final name acceptance is determined by the Colorado Secretary of State.");
        }
        if (!"CO".equalsIgnoreCase(trim(request.registeredAgentState()))) {
            errors.add("Registered agent physical address must be in Colorado.");
        }
        if (!request.registeredAgentConsent()) {
            errors.add("Registered agent consent is required before filing.");
        }
        if (request.managementType() == null) {
            errors.add("Management type must be MEMBER_MANAGED or MANAGER_MANAGED.");
        }
        if (request.registeredAgentType() == null) {
            errors.add("Registered agent type is required.");
        } else if (request.registeredAgentType() == RegisteredAgentType.INDIVIDUAL) {
            var method = request.registeredAgentVerificationMethod();
            if (method != RegisteredAgentVerificationMethod.COLORADO_ID && method != RegisteredAgentVerificationMethod.SOS_PASSCODE) {
                errors.add("Individual Colorado registered agents require an allowed residency verification method.");
            }
        } else if (request.registeredAgentType() == RegisteredAgentType.ENTITY) {
            if (request.registeredAgentVerificationMethod() != RegisteredAgentVerificationMethod.ENTITY_GOOD_STANDING || !request.registeredAgentEntityGoodStanding()) {
                errors.add("Entity registered agent must be represented as registered and in good standing before handoff.");
            }
        }

        return new ColoradoLlcValidationResult(errors.isEmpty(), errors, "assisted_official_handoff");
    }

    private static void require(List<String> errors, String value, String message) {
        if (value == null || value.isBlank()) errors.add(message);
    }

    private static String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private static boolean hasLlcDesignator(String legalName) {
        String normalized = legalName.toLowerCase(Locale.ROOT).replace(".", "").trim();
        return normalized.endsWith(" llc") || normalized.endsWith(" limited liability company") || normalized.endsWith(" limited liability co");
    }
}
