import "./styles/primary-input.css";

export default function PrimaryInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
  disabled = false,
  readOnly = false,
}) {
  return (
    <div className="primary-input">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={Boolean(error)}
      />
      {error && <span className="primary-input__error">{error}</span>}
    </div>
  );
}
