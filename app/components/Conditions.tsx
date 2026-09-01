"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, AlertTriangle, Stethoscope, X } from "lucide-react";
import { format, type ConditionDetail, type UiDictionary } from "../i18n/types";

type Copy = NonNullable<UiDictionary["conditions"]>;

/** The clinical card and this modal are adult-mode only, and nothing here is
 *  ever read aloud — a list of ways an organ fails is not narration material. */
export function ConditionsModal({
  organName,
  names,
  details,
  copy,
  easy,
  closeLabel,
  initial,
  onClose,
}: {
  organName: string;
  /** The organ's own condition list, kept as the ordering authority. */
  names: string[];
  details: ConditionDetail[];
  copy: Copy;
  /** The easy reading. Every field falls back to its full version when the
   *  plain one has not been written, so a half-filled entry still reads. */
  easy?: boolean;
  closeLabel: string;
  /** Opens straight into one condition when the card item was clicked. */
  initial: string | null;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(initial);
  const detail = selected ? details.find((entry) => entry.name === selected) : undefined;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="learning-modal conditions-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="conditions-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label={closeLabel}><X size={18} /></button>

        {detail ? (
          <ConditionBody
            detail={detail}
            copy={copy}
            easy={easy}
            onBack={initial ? null : () => setSelected(null)}
          />
        ) : (
          <>
            <span className="modal-icon"><Stethoscope size={18} /></span>
            <h2 id="conditions-title">{format(copy.listTitle, { organ: organName })}</h2>
            <ul className="conditions-list">
              {names.map((name) => {
                const entry = details.find((item) => item.name === name);
                if (!entry) {
                  // Written up later. Listed, but there is nothing to open.
                  return (
                    <li key={name} className="bare">
                      <span>{name}</span>
                      <small>{copy.noDetail}</small>
                    </li>
                  );
                }
                return (
                  <li key={name}>
                    <button type="button" onClick={() => setSelected(name)}>
                      <span>
                        <b>{name}</b>
                        {entry.urgent && <em className="urgent-badge small"><AlertTriangle size={11} /> {copy.urgent}</em>}
                        <small>{easy && entry.oneLineEasy ? entry.oneLineEasy : entry.oneLine}</small>
                      </span>
                      <ArrowRight size={15} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <p className="conditions-disclaimer">{copy.disclaimer}</p>
      </section>
    </div>
  );
}

function ConditionBody({
  detail,
  copy,
  easy,
  onBack,
}: {
  detail: ConditionDetail;
  copy: Copy;
  easy?: boolean;
  onBack: (() => void) | null;
}) {
  const symptoms = easy && detail.symptomsEasy ? detail.symptomsEasy : detail.symptoms;
  const note = easy && detail.noteEasy ? detail.noteEasy : detail.note;
  return (
    <>
      {onBack && (
        <button type="button" className="conditions-back" onClick={onBack}>
          <ArrowLeft size={14} /> {copy.back}
        </button>
      )}

      {detail.urgent && (
        <p className="urgent-badge"><AlertTriangle size={14} /> {copy.urgent}</p>
      )}

      <h2 id="conditions-title">{detail.name}</h2>
      <p className="condition-oneline">{easy && detail.oneLineEasy ? detail.oneLineEasy : detail.oneLine}</p>

      <section className="condition-section">
        <h3>{copy.what}</h3>
        <p>{easy && detail.whatEasy ? detail.whatEasy : detail.what}</p>
      </section>

      <section className="condition-section">
        <h3>{copy.symptoms}</h3>
        <ul className="condition-symptoms">
          {symptoms.map((symptom) => <li key={symptom}>{symptom}</li>)}
        </ul>
      </section>

      <section className="condition-section">
        <h3>{copy.causes}</h3>
        <p>{easy && detail.causesEasy ? detail.causesEasy : detail.causes}</p>
      </section>

      {/* Two columns, same border, same background, same type. The moment the
          changeable one looks louder, the card starts saying "you let this
          happen" — which is both untrue and the opposite of the point. */}
      <section className="condition-section">
        <h3>{copy.risk}</h3>
        <div className="condition-factors">
          <div>
            <h4>{copy.fixed}</h4>
            <ul>{detail.fixedFactors.map((factor) => <li key={factor}>{factor}</li>)}</ul>
          </div>
          <div>
            <h4>{copy.modifiable}</h4>
            <ul>{detail.modifiableFactors.map((factor) => <li key={factor}>{factor}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* The one block that has to be seen if nothing else is. It reads the
          same in both settings: no entry carries a `seeDoctorEasy`, because
          shortening a list of warning signs means dropping one of them. The
          fallback is here so a plain version that loses nothing can be added
          later without touching this file. */}
      <section className="condition-section see-doctor">
        <h3><Stethoscope size={15} /> {copy.seeDoctor}</h3>
        <p>{easy && detail.seeDoctorEasy ? detail.seeDoctorEasy : detail.seeDoctor}</p>
      </section>

      {note && (
        <section className="condition-section condition-note">
          <h3>{copy.note}</h3>
          <p>{note}</p>
        </section>
      )}
    </>
  );
}
