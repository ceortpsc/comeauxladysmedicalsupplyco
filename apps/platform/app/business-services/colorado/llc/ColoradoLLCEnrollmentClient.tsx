"use client";

import { FormEvent, useState } from "react";
import type { ColoradoLLCDraft, ValidationIssue } from "../../../../lib/colorado-business";
import styles from "./ColoradoLLCEnrollment.module.css";

const emptyDraft: ColoradoLLCDraft = {
  legalName: "",
  principalOffice: { street1: "", street2: "", city: "", state: "", postalCode: "", country: "US" },
  mailingSameAsPrincipal: true,
  mailingAddress: { street1: "", street2: "", city: "", state: "", postalCode: "", country: "US" },
  registeredAgent: {
    type: "individual",
    name: "",
    street1: "",
    street2: "",
    city: "",
    state: "CO",
    postalCode: "",
    consentConfirmed: false,
    verificationMethod: "",
    entityGoodStandingConfirmed: false
  },
  management: "",
  atLeastOneMemberConfirmed: false,
  organizer: { fullName: "", mailingStreet1: "", mailingStreet2: "", city: "", state: "", postalCode: "", country: "US" },
  delayedEffectiveDate: "",
  emailNotifications: true,
  feeReliefRequested: false,
  stateFeeAcknowledged: false
};

type Handoff = {
  status: string;
  transmittalMode: string;
  directStateApi: boolean;
  officialFilingUrl: string;
  officialNameAvailabilityUrl: string;
  packetId: string;
  packetHash: string;
  nextAction: string;
};

export default function ColoradoLLCEnrollmentClient() {
  const [draft, setDraft] = useState<ColoradoLLCDraft>(emptyDraft);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [handoff, setHandoff] = useState<Handoff | null>(null);
  const [busy, setBusy] = useState(false);

  const setPrincipal = (key: keyof ColoradoLLCDraft["principalOffice"], value: string) =>
    setDraft((d) => ({ ...d, principalOffice: { ...d.principalOffice, [key]: value } }));
  const setMailing = (key: keyof NonNullable<ColoradoLLCDraft["mailingAddress"]>, value: string) =>
    setDraft((d) => ({ ...d, mailingAddress: { ...(d.mailingAddress ?? emptyDraft.mailingAddress!), [key]: value } }));
  const setAgent = (key: keyof ColoradoLLCDraft["registeredAgent"], value: string | boolean) =>
    setDraft((d) => ({ ...d, registeredAgent: { ...d.registeredAgent, [key]: value } }));
  const setOrganizer = (key: keyof ColoradoLLCDraft["organizer"], value: string) =>
    setDraft((d) => ({ ...d, organizer: { ...d.organizer, [key]: value } }));

  async function prepareHandoff(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setIssues([]);
    setHandoff(null);
    try {
      const validation = await fetch("/api/business-filings/colorado/llc/validate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft)
      });
      const result = await validation.json();
      if (!validation.ok || !result.valid) {
        setIssues(result.issues ?? [{ field: "application", message: "Validation failed." }]);
        return;
      }
      const response = await fetch("/api/business-filings/colorado/llc/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft)
      });
      const packet = await response.json();
      if (!response.ok) {
        setIssues(packet.issues ?? [{ field: "application", message: packet.error ?? "Unable to prepare handoff packet." }]);
        return;
      }
      setHandoff(packet);
    } catch {
      setIssues([{ field: "network", message: "The application service could not be reached. Your browser form remains available; no Colorado filing was submitted." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={prepareHandoff}>
      <div className={styles.steps} aria-label="Colorado LLC enrollment steps">
        {["Entity", "Office", "Agent", "Governance", "Organizer", "Handoff"].map((step, index) => (
          <div key={step} className={`${styles.step} ${index < 5 ? styles.activeStep : ""}`}>{index + 1}. {step}</div>
        ))}
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2>1. Entity identity</h2>
          <div className={styles.field}>
            <label htmlFor="legalName">Proposed Colorado LLC legal name</label>
            <input id="legalName" value={draft.legalName} onChange={(e) => setDraft((d) => ({ ...d, legalName: e.target.value }))} placeholder="Example Medical Supply Co LLC" autoComplete="organization" />
          </div>
          <p className={styles.small}>The exact name must be distinguishable in Colorado and include an accepted LLC designator. Name availability is confirmed on the official SOS site before filing.</p>
        </section>

        <section className={styles.card}>
          <h2>2. Principal office</h2>
          <div className={styles.field}><label>Street address</label><input value={draft.principalOffice.street1} onChange={(e) => setPrincipal("street1", e.target.value)} /></div>
          <div className={styles.field}><label>Suite / unit</label><input value={draft.principalOffice.street2} onChange={(e) => setPrincipal("street2", e.target.value)} /></div>
          <div className={styles.inline}>
            <div className={styles.field}><label>City</label><input value={draft.principalOffice.city} onChange={(e) => setPrincipal("city", e.target.value)} /></div>
            <div className={styles.field}><label>State / province</label><input value={draft.principalOffice.state} onChange={(e) => setPrincipal("state", e.target.value)} /></div>
          </div>
          <div className={styles.inline}>
            <div className={styles.field}><label>Postal code</label><input value={draft.principalOffice.postalCode} onChange={(e) => setPrincipal("postalCode", e.target.value)} /></div>
            <div className={styles.field}><label>Country</label><input value={draft.principalOffice.country} onChange={(e) => setPrincipal("country", e.target.value)} /></div>
          </div>
          <label className={styles.check}><input type="checkbox" checked={draft.mailingSameAsPrincipal} onChange={(e) => setDraft((d) => ({ ...d, mailingSameAsPrincipal: e.target.checked }))} /> Mailing address is the same as principal office</label>
          {!draft.mailingSameAsPrincipal && <div className={styles.locked}>
            <strong>Separate mailing address</strong>
            <div className={styles.field}><label>Mailing address</label><input value={draft.mailingAddress?.street1 ?? ""} onChange={(e) => setMailing("street1", e.target.value)} /></div>
            <div className={styles.inline}><div className={styles.field}><label>City</label><input value={draft.mailingAddress?.city ?? ""} onChange={(e) => setMailing("city", e.target.value)} /></div><div className={styles.field}><label>State</label><input value={draft.mailingAddress?.state ?? ""} onChange={(e) => setMailing("state", e.target.value)} /></div></div>
            <div className={styles.field}><label>Postal code</label><input value={draft.mailingAddress?.postalCode ?? ""} onChange={(e) => setMailing("postalCode", e.target.value)} /></div>
          </div>}
        </section>

        <section className={styles.card}>
          <h2>3. Colorado registered agent</h2>
          <div className={styles.inline}>
            <div className={styles.field}><label>Agent type</label><select value={draft.registeredAgent.type} onChange={(e) => setAgent("type", e.target.value)}><option value="individual">Individual</option><option value="entity">Entity</option></select></div>
            <div className={styles.field}><label>Agent name</label><input value={draft.registeredAgent.name} onChange={(e) => setAgent("name", e.target.value)} /></div>
          </div>
          <div className={styles.field}><label>Colorado physical street address</label><input value={draft.registeredAgent.street1} onChange={(e) => setAgent("street1", e.target.value)} /></div>
          <div className={styles.inline}><div className={styles.field}><label>City</label><input value={draft.registeredAgent.city} onChange={(e) => setAgent("city", e.target.value)} /></div><div className={styles.field}><label>ZIP</label><input value={draft.registeredAgent.postalCode} onChange={(e) => setAgent("postalCode", e.target.value)} /></div></div>
          <div className={styles.field}><label>Verification path</label><select value={draft.registeredAgent.verificationMethod} onChange={(e) => setAgent("verificationMethod", e.target.value)}><option value="">Select…</option>{draft.registeredAgent.type === "individual" ? <><option value="colorado_id">Colorado ID / driver license verification — entered only at SOS</option><option value="agent_passcode">SOS mailed agent passcode</option></> : <option value="entity_good_standing">Colorado entity in good standing</option>}</select></div>
          {draft.registeredAgent.type === "entity" && <label className={styles.check}><input type="checkbox" checked={Boolean(draft.registeredAgent.entityGoodStandingConfirmed)} onChange={(e) => setAgent("entityGoodStandingConfirmed", e.target.checked)} /> I confirmed the registered-agent entity is registered and in good standing in Colorado.</label>}
          <label className={styles.check}><input type="checkbox" checked={draft.registeredAgent.consentConfirmed} onChange={(e) => setAgent("consentConfirmed", e.target.checked)} /> The registered agent has consented to the appointment.</label>
          <div className={styles.notice}><strong>Privacy gate:</strong> this interface does not request or retain a Colorado driver-license/ID number. Enter that directly on the Colorado SOS site when required.</div>
        </section>

        <section className={styles.card}>
          <h2>4. Management & membership</h2>
          <div className={styles.field}><label>Who manages the LLC?</label><select value={draft.management} onChange={(e) => setDraft((d) => ({ ...d, management: e.target.value as ColoradoLLCDraft["management"] }))}><option value="">Select…</option><option value="members">Members</option><option value="managers">Managers</option></select></div>
          <label className={styles.check}><input type="checkbox" checked={draft.atLeastOneMemberConfirmed} onChange={(e) => setDraft((d) => ({ ...d, atLeastOneMemberConfirmed: e.target.checked }))} /> I confirm the LLC will have at least one member.</label>
          <div className={styles.field}><label>Optional delayed effective date</label><input type="date" value={draft.delayedEffectiveDate} onChange={(e) => setDraft((d) => ({ ...d, delayedEffectiveDate: e.target.value }))} /></div>
          <label className={styles.check}><input type="checkbox" checked={draft.emailNotifications} onChange={(e) => setDraft((d) => ({ ...d, emailNotifications: e.target.checked }))} /> Request Colorado SOS email-notification enrollment during the official filing flow.</label>
        </section>

        <section className={styles.card}>
          <h2>5. Organizer</h2>
          <div className={styles.field}><label>Organizer / person forming LLC</label><input value={draft.organizer.fullName} onChange={(e) => setOrganizer("fullName", e.target.value)} /></div>
          <div className={styles.field}><label>Mailing street address</label><input value={draft.organizer.mailingStreet1} onChange={(e) => setOrganizer("mailingStreet1", e.target.value)} /></div>
          <div className={styles.inline}><div className={styles.field}><label>City</label><input value={draft.organizer.city} onChange={(e) => setOrganizer("city", e.target.value)} /></div><div className={styles.field}><label>State</label><input value={draft.organizer.state} onChange={(e) => setOrganizer("state", e.target.value)} /></div></div>
          <div className={styles.inline}><div className={styles.field}><label>Postal code</label><input value={draft.organizer.postalCode} onChange={(e) => setOrganizer("postalCode", e.target.value)} /></div><div className={styles.field}><label>Country</label><input value={draft.organizer.country} onChange={(e) => setOrganizer("country", e.target.value)} /></div></div>
        </section>

        <section className={styles.card}>
          <h2>6. Fees & transmittal</h2>
          <div className={styles.notice}><strong>Fee-relief status:</strong> no current Colorado LLC fee-waiver/reduction has been verified. The HB22-1001 program was temporary and affected 2022–2023 filings.</div>
          <label className={styles.check}><input type="checkbox" checked={draft.feeReliefRequested} onChange={(e) => setDraft((d) => ({ ...d, feeReliefRequested: e.target.checked }))} /> Request fee-relief review. This will be blocked unless an active official Colorado program is verified.</label>
          <label className={styles.check}><input type="checkbox" checked={draft.stateFeeAcknowledged} onChange={(e) => setDraft((d) => ({ ...d, stateFeeAcknowledged: e.target.checked }))} /> I understand state filing fees are separate, subject to change, and must be confirmed in the official SOS portal.</label>
          <p className={styles.small}>Transmittal mode is <strong>assisted official handoff</strong>. The platform validates and prepares the filing packet, then transfers the user to Colorado SOS for identity verification, payment, attestation, and final submission. There is no authorized direct-write state API configured.</p>
        </section>
      </div>

      {issues.length > 0 && <div className={styles.issues} role="alert">{issues.map((issue, index) => <div key={`${issue.field}-${index}`} className={styles.issue}><strong>{issue.field}:</strong> {issue.message}</div>)}</div>}

      {handoff && <div className={styles.success}>
        <strong>Handoff packet ready.</strong>
        <p>Packet ID: <span className={styles.mono}>{handoff.packetId}</span></p>
        <p>Integrity hash: <span className={styles.mono}>{handoff.packetHash}</span></p>
        <p>{handoff.nextAction}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={handoff.officialFilingUrl} target="_blank" rel="noreferrer">Continue to Colorado SOS</a>
          <a className={styles.secondary} href={handoff.officialNameAvailabilityUrl} target="_blank" rel="noreferrer">Check name availability</a>
        </div>
      </div>}

      <div className={styles.actions}>
        <button type="submit" className={styles.primary} disabled={busy}>{busy ? "Validating…" : "Validate & prepare official handoff"}</button>
        <a className={styles.secondary} href="/business-services/colorado/llc/fee-relief">Review fee-relief status</a>
      </div>
    </form>
  );
}
