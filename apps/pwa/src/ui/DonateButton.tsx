import React from "react";

export const DonateButton: React.FC = () => {
    const DONATE_URL = "https://github.com/sponsors/w1ne"; // Placeholder URL

    return (
        <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="donate-button"
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 12px",
                backgroundColor: "#ea4aaa", // Pinkish color to stand out
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "0.9rem",
                border: "none",
                cursor: "pointer",
                marginLeft: "8px"
            }}
        >
            ♥ Donate
        </a>
    );
};
