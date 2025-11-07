import { useState } from 'react';
import type { MlString, Lang } from '../../i18n/types';
import styles from './MlStringInput.module.scss';

type Props = {
  label: string;
  value: MlString;
  onChange: (v: MlString) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
};

const langs: Lang[] = ['kz', 'ru', 'en'];

const LANG_LABELS: Record<Lang, string> = {
  kz: 'ҚАЗ',
  ru: 'РУС',
  en: 'ENG',
};

export default function MlStringInput({
  label,
  value = {},
  onChange,
  required = false,
  placeholder,
  rows = 3,
}: Props) {
  const [activeLang, setActiveLang] = useState<Lang>('ru');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
        <div className={styles.tabs}>
          {langs.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`${styles.tab} ${activeLang === lang ? styles.active : ''}`}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>
      </div>
      <textarea
        className={styles.input}
        rows={rows}
        value={value?.[activeLang] ?? ''}
        onChange={(e) => onChange({ ...value, [activeLang]: e.target.value })}
        placeholder={placeholder ?? `Введите текст (${LANG_LABELS[activeLang]})`}
      />
      <p className={styles.hint}>
        Оставленные пустыми языки будут использовать фоллбек на другие языки.
      </p>
    </div>
  );
}

