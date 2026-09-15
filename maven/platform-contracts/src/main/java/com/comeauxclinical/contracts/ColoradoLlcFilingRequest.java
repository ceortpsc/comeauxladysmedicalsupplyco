package com.comeauxclinical.contracts;

public record ColoradoLlcFilingRequest(
        String legalName,
        String principalStreet,
        String principalCity,
        String principalState,
        String principalPostalCode,
        String registeredAgentName,
        RegisteredAgentType registeredAgentType,
        RegisteredAgentVerificationMethod registeredAgentVerificationMethod,
        boolean registeredAgentEntityGoodStanding,
        String registeredAgentStreet,
        String registeredAgentCity,
        String registeredAgentState,
        String registeredAgentPostalCode,
        boolean registeredAgentConsent,
        ManagementType managementType,
        String organizerName
) {}
