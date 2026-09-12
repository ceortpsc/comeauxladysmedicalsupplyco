import type { Metadata } from "next";
import styles from "../ColoradoLLCEnrollment.module.css";
import { COLORADO_SOS } from "../../../../../lib/colorado-business";

export const metadata: Metadata = {
  title: "Colorado LLC Fee Relief Status",
  description: "Colorado LLC state-fee relief eligibility and historical-program disclosure."
};

export default function ColoradoLLCFeeReliefPage() {
  return (
    <div className={styles.shell}>
      <p className="eyebrow">Colorado LLC • Fee Review</p>
      <h1 className={styles.title}>State filing fee & fee-relief gate</h1>
      <div className={styles.grid}>
        <section className={styles.card}>
          <span className="badge">CURRENT SYSTEM STATUS</span>
          <h2>No active LLC fee-relief program verified</h2>
          <p className={styles.lead}>The application workflow must not display a $0 or $1 Colorado state LLC filing charge unless the Colorado Secretary of State publishes an active program and the filing qualifies.</p>
          <div className={styles.notice}><strong>Historical program:</strong> {COLORADO_SOS.feeRelief.historicalProgram}. Colorado reported that the reduced LLC and trade-name fees affected filings in {COLORADO_SOS.feeRelief.historicalWindow}.</div>
        </section>
        <section className={styles.card}>
          <h2>Standard fee reference</h2>
          <div className={styles.statusRow}><span>Articles of Organization reference</span><strong>${(COLORADO_SOS.standardArticlesFeeCents / 100).toFixed(2)}</strong></div>
          <div className={styles.statusRow}><span>Trade-name reference</span><strong>${(COLORADO_SOS.standardTradeNameFeeCents / 100).toFixed(2)}</strong></div>
          <p className={styles.small}>These are reference amounts derived from Colorado’s published program history and must be re-confirmed at the official filing portal because state fee schedules can change.</p>
        </section>
      </div>
      <section className={styles.card} style={{ marginTop: "1rem" }}>
        <h2>Waiver/reduction decision logic</h2>
        <div className="list">
          <div className="listItem"><strong>1.</strong> Query or review an official Colorado SOS source for a current fee-relief program.</div>
          <div className="listItem"><strong>2.</strong> Confirm effective dates, filing types, eligibility conditions and available appropriation/funding.</div>
          <div className="listItem"><strong>3.</strong> Store the official source URL, retrieval date and program identifier in the filing audit record.</div>
          <div className="listItem"><strong>4.</strong> Only then enable a reduced-fee selection. Otherwise the state-fee acknowledgment remains required.</div>
        </div>
        <div className={styles.actions}>
          <a className={styles.primary} href="/business-services/colorado/llc">Return to LLC enrollment</a>
          <a className={styles.secondary} href={COLORADO_SOS.officialBusinessHome} target="_blank" rel="noreferrer">Colorado SOS Business</a>
        </div>
      </section>
    </div>
  );
}
