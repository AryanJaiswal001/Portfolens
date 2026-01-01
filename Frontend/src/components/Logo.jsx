import logoImage from "../../assets/PortfoLens_v2.png";

export default function Logo({ className = "w-8 h-8" }) {
  return (
    <img
      src={logoImage}
      alt="PortfoLens"
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}
