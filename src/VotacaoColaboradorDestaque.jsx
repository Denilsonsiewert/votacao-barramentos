import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const candidatos = [
  { id: 1, nome: "DJENEFER PAOLA GOMES" },
  { id: 2, nome: "EDENILSON RODRIGUES DA SILVA" },
   { id: 4, nome: "IZAEL FELIPE CARVALHO DA SILVA" },
  { id: 5, nome: "JEAN PAULO MARTINI" },
  { id: 18, nome: "JOAO VICTOR SABINO VIANA" },
  { id: 15, nome: "KAUA STHEVAN DE SOUZA" },
  { id: 6, nome: "LUCAS FERNANDO LOOSE" },
  { id: 7, nome: "MARCELO FERRAZ" },
  { id: 8, nome: "MOACIR PEREIRA DA SILVA" },
  { id: 9, nome: "ROBERVAL FELIZARDO MARTINS" },
  { id: 17, nome: "ROSANGELA GONCALVES DE OLIVEIRA VERA" },
  { id: 11, nome: "RONILSON PEREIRA DE SOUZA" },
  { id: 13, nome: "TONNY HABITZREUTER" },
  { id: 14, nome: "VINÍCIUS LIMA DA SILVA" },
  { id: 16, nome: "VINICIUS DA SILVA TRINDADE" }
].sort((a, b) => a.nome.localeCompare(b.nome));

export default function VotacaoColaboradorDestaque() {
  const [voto, setVoto] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [resultados, setResultados] = useState({});
  const [erro, setErro] = useState(null);
  const [selectedNome, setSelectedNome] = useState("");

  const enviarVoto = async () => {
    if (voto === null) {
      setErro("Selecione um colaborador.");
      return;
    }

    const candidato = candidatos.find((c) => c.id === voto);
    if (!candidato) {
      setErro("Candidato não encontrado.");
      return;
    }

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycby7a3ys1YejRRFLEgnJuvPMvokwSfa9rk-XqCcT_BZPAHYloYpXRB_zi-c0B2-PelWu/exec",
        {
          method: "POST",
          body: JSON.stringify({ nome: candidato.nome }),
          headers: { "Content-Type": "application/json" },
          mode: "no-cors"
        }
      );

      setResultados((prev) => ({ ...prev, [voto]: (prev[voto] || 0) + 1 }));
      setSelectedNome(candidato.nome);
      setEnviado(true);
      setErro(null);
    } catch {
      setErro("Falha ao enviar o voto. Tente novamente mais tarde.");
    }
  };

  return (
    <motion.div
      className="relative max-w-3xl mx-auto p-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0 }}
    >
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0 }}
      >
        Votação Colaborador Destaque - Barramentos
      </motion.h1>

      {erro && <div style={{ color: "red", marginBottom: "1rem" }}>{erro}</div>}

      <AnimatePresence>
        {!enviado ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "grid", gap: "1rem" }}
          >
            {candidatos.map((colab) => (
              <motion.div
                key={colab.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0 }}
                style={{
                  border: voto === colab.id ? "2px solid blue" : "1px solid #ccc",
                  padding: "1rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() => setVoto(colab.id)}
              >
                <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>{colab.nome}</p>
                {voto === colab.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: "0.5rem" }}
                  >
                    <button
                      onClick={enviarVoto}
                      style={{
                        padding: "0.5rem 1.5rem",
                        fontSize: "1rem",
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Confirmar Voto
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0 }}
          >
            <div style={{ color: "green", fontSize: "1.5rem", fontWeight: "bold" }}>
              Obrigado por votar!
            </div>
            <div style={{ fontSize: "1.1rem" }}>
              Seu voto foi para: <strong>{selectedNome}</strong>
            </div>
            <div style={{ fontSize: "1rem", color: "#666" }}>
              Aguarde a divulgação dos resultados.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
