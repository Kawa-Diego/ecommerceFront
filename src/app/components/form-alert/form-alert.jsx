export default function FormAlert({ message, errors = [] }) {
  if (!message && errors.length === 0) {
    return null;
  }

  return (
    <div className="form-alert" role="alert">
      {message && <p>{message}</p>}
      {errors.length > 0 && (
        <ul>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
