package com.comeauxclinical.regulatory.colorado;

import com.comeauxclinical.contracts.ColoradoLlcFilingRequest;
import com.comeauxclinical.contracts.ManagementType;
import com.comeauxclinical.contracts.RegisteredAgentType;
import com.comeauxclinical.contracts.RegisteredAgentVerificationMethod;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ColoradoLlcValidationServiceTest {
    private final ColoradoLlcValidationService service = new ColoradoLlcValidationService();

    @Test
    void acceptsCompleteAssistedHandoffPacket() {
        var request = new ColoradoLlcFilingRequest(
                "COMEAUX LADYS MED SUPPLY CO LLC",
                "2509 Cody Poe Rd Unit B", "Killeen", "TX", "76549",
                "Colorado Registered Agent",
                RegisteredAgentType.INDIVIDUAL,
                RegisteredAgentVerificationMethod.SOS_PASSCODE,
                false,
                "1700 Broadway", "Denver", "CO", "80290",
                true,
                ManagementType.MEMBER_MANAGED,
                "Alzor M. Martin Comeaux"
        );

        var result = service.validate(request);
        assertTrue(result.valid(), () -> String.join("; ", result.errors()));
    }

    @Test
    void rejectsMissingConsentAndNonColoradoAgentAddress() {
        var request = new ColoradoLlcFilingRequest(
                "COMEAUX LADYS MED SUPPLY CO LLC",
                "2509 Cody Poe Rd Unit B", "Killeen", "TX", "76549",
                "Agent",
                RegisteredAgentType.INDIVIDUAL,
                RegisteredAgentVerificationMethod.COLORADO_ID,
                false,
                "1 Main St", "Killeen", "TX", "76549",
                false,
                ManagementType.MEMBER_MANAGED,
                "Organizer"
        );

        var result = service.validate(request);
        assertFalse(result.valid());
        assertTrue(result.errors().stream().anyMatch(e -> e.contains("Colorado")));
        assertTrue(result.errors().stream().anyMatch(e -> e.contains("consent")));
    }
}
