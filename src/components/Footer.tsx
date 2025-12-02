import React from "react";

export function Footer() {
  return (
    <footer style={styles.footer}>
      <p>IFSC ©2025 — Desenvolvido por Gustavo Tessaro e Lucas Oliveira Bleyer</p>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    marginTop: "2rem",
    paddingTop: "1rem",
    textAlign: "center",
    backgroundColor: "#f27216a3",
  },
};
