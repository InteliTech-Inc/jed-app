import "../app/spinner.css";

interface SpinnerProps {
  size?: string;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "1.48rem",
  color = "var(--color-accent)",
}) => {
  const spinnerStyle = {
    "--spinner-size": size,
    "--spinner-color": color,
  } as React.CSSProperties;

  return <div className="spinner" style={spinnerStyle}></div>;
};

export { Spinner };
