import { Status } from "@/lib/types";

interface StatusPillProps {
    status: Status;
    label?: string;
    tooltip?: string;
    size?: "sm" | "md";
}

export function StatusPill({ status, label, tooltip, size = "md" }: StatusPillProps) {
    const getStyle = () => {
        switch (status) {
            case "ok":
                return { bg: "var(--verde)", text: "OK" };
            case "alert":
                return { bg: "var(--amarillo)", text: "ALERTA" };
            case "critical":
                return { bg: "var(--rojo)", text: "CRÍTICO" };
            default:
                return { bg: "var(--texto3)", text: "N/D" };
        }
    };

    const current = getStyle();
    const px = size === "sm" ? "8px" : "12px";
    const py = size === "sm" ? "2px" : "4px";
    const fontSize = size === "sm" ? "0.65rem" : "0.75rem";

    return (
        <span
            title={tooltip}
            style={{
                backgroundColor: current.bg,
                color: "white",
                padding: `${py} ${px}`,
                borderRadius: "12px",
                fontSize: fontSize,
                fontWeight: 600,
                textTransform: "uppercase",
                display: "inline-block",
                cursor: tooltip ? "help" : "default"
            }}
        >
            {label || current.text}
        </span>
    );
}
