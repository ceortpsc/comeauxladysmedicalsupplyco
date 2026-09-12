import type { Metadata } from "next";
import ColoradoLLCEnrollmentClient from "./ColoradoLLCEnrollmentClient";
import styles from "./ColoradoLLCEnrollment.module.css";
import { COLORADO_SOS, getColoradoLLCChecklist } from "../../../../lib/colorado-business";

export const metadata: Metadata = {
  title: "Colorado LLC Enrollment",
  description: "Prepare and validate a Colorado LLC Articles of Organization packet, then continue to the official Colorado Secretary of State filing system."
};

export default function ColoradoLLCEnrollmentPage() {
  const checklist = getColoradoLLCChecklist();
  return (
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div>
          <p className="eyebrow">Business Services • Colorado</p>
          <h1 className={styles.title}>Colorado LLC enrollment & official filing handoff</h1>
          <p className={styles.lead}>Prepare the Colorado Articles of Organization data set, validate required fields, review registered-agent eligibility, check fee-relief status, and create an integrity-tracked handoff to the official Colorado Secretary of State filing portal.</p>
          <div className={styles.notice}><strong>Government filing boundary:</strong> Comeaux/254-Tax can prepare and validate the application workflow. Colorado identity verification, payment, legal attestation, acceptance, and final state submission occur on the Colorado Secretary of State system unless an authorized state API is later established.</div>
        </div>
        <aside className={styles.status}>
          <h3>Connection status</h3>
          <div className={styles.statusRow}><span>Colorado SOS official handoff</span><span className={styles.ok}>CONNECTED BY LINK</span></div>
          <div className={styles.statusRow}><span>Direct state write API</span><span className={styles.warn}>NOT AUTHORIZED</span></div>
          <div className={styles.statusRow}><span>Current fee relief</span><span className={styles.warn}>NOT VERIFIED ACTIVE</span></div>
          <div className={styles.statusRow}><span>Registered-agent rules</span><span className={styles.ok}>2025+ GATED</span></div>
        </aside>
      </section>

      <section className={styles.card}>
        <h2>Official Colorado checklist</h2>
        <div className="list">{checklist.map((item) => <div className="listItem" key={item}>{item}</div>)}</div>
        <div className={styles.actions}>
          <a className={styles.secondary} href={COLORADO_SOS.officialNameAvailability} target="_blank" rel="noreferrer">Official name availability</a>
          <a className={styles.secondary} href={COLORADO_SOS.registeredAgentRequirements} target="_blank" rel="noreferrer">Registered-agent requirements</a>
          <a className={styles.secondary} href={COLORADO_SOS.officialChecklist} target="_blank" rel="noreferrer">Official LLC checklist PDF</a>
        </div>
      </section>

      <ColoradoLLCEnrollmentClient />

      <section className={styles.footerGrid}>
        <div className={styles.card}><h3>Privacy</h3><p className={styles.small}>Do not enter SSNs, EIN responsible-party identifiers, or Colorado driver-license/ID numbers into this public-facing filing-preparation module. State identity fields belong directly in the government portal.</p></div>
        <div className={styles.card}><h3>Fee disclosure</h3><p className={styles.small}>Our service or membership price is separate from government charges. State fees can change and are confirmed at checkout on the official Colorado SOS portal.</p></div>
        <div className={styles.card}><h3>Legal notice</h3><p className={styles.small}>Application assistance is administrative/educational support and is not legal advice or a guarantee that Colorado will accept a filing.</p></div>
      </section>
    </div>
  );
}
