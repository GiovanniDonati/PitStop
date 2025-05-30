import { Trash2 } from "lucide-react";
import { useState } from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Orcamento() {
  const gerarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Orçamento de Manutenção", 14, 20);

    doc.setFontSize(12);
    doc.text(`Cliente: ${veiculo.cliente}`, 14, 30);
    doc.text(`Veículo: ${veiculo.modelo} - ${veiculo.ano}`, 14, 38);
    doc.text(`Placa: ${veiculo.placa}`, 14, 46);

    autoTable(doc, {
      startY: 55,
      head: [["Peça", "Qtd", "Valor Unitário", "Mão de Obra", "Subtotal"]],
      body: pecas.map((p) => [
        p.nome,
        p.quantidade,
        `R$ ${p.valor.toFixed(2)}`,
        `R$ ${p.maoDeObra.toFixed(2)}`,
        `R$ ${(p.quantidade * p.valor + p.maoDeObra).toFixed(2)}`,
      ]),
    });

    const y = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(`Total Peças: R$ ${totalPecas.toFixed(2)}`, 14, y);
    doc.text(`Total Mão de Obra: R$ ${totalMaoDeObra.toFixed(2)}`, 14, y + 8);
    doc.setFontSize(14);
    doc.text(`Total Geral: R$ ${totalGeral.toFixed(2)}`, 14, y + 20);

    doc.save(`orcamento-${veiculo.placa || "veiculo"}.pdf`);
  };

  const [veiculo, setVeiculo] = useState({
    placa: "",
    modelo: "",
    ano: "",
    cliente: "",
  });

  const [pecas, setPecas] = useState([
    { nome: "", quantidade: 1, valor: 0, maoDeObra: 0 },
  ]);

  const handlePecaChange = (index, field, value) => {
    const updated = [...pecas];
    updated[index][field] =
      field === "quantidade" || field === "valor" || field === "maoDeObra"
        ? Number(value)
        : value;
    setPecas(updated);
  };

  const addPeca = () => {
    setPecas([...pecas, { nome: "", quantidade: 1, valor: 0, maoDeObra: 0 }]);
  };

  const removePeca = (index) => {
    const updated = pecas.filter((_, i) => i !== index);
    setPecas(updated);
  };

  const totalPecas = pecas.reduce(
    (total, p) => total + p.quantidade * p.valor,
    0
  );

  const totalMaoDeObra = pecas.reduce((total, p) => total + p.maoDeObra, 0);

  const totalGeral = totalPecas + totalMaoDeObra;

  return (
    <div className="flex bg-gray-100 grow h-aut min-h-screen">
      <div className="flex flex-col p-8 pb-32 grow max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">Novo Orçamento</h2>
        <p className="text-gray-600 mb-8">
          Preencha os dados abaixo para gerar um orçamento de manutenção.
        </p>

        {/* Informações do veículo */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Informações do Veículo</h3>
          <div className="grid grid-cols-4 gap-4">
            {["placa", "modelo", "ano", "cliente"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="border p-2 rounded"
                value={veiculo[field]}
                onChange={(e) =>
                  setVeiculo({ ...veiculo, [field]: e.target.value })
                }
              />
            ))}
          </div>
        </div>

        {/* Peças com valores e MO */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Peças e Mão de Obra</h3>
          <div className="space-y-4">
            {pecas.map((peca, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between mb-2 gap-2">
                  <input
                    type="text"
                    placeholder="Nome da peça"
                    className="border p-2 rounded w-full"
                    value={peca.nome}
                    onChange={(e) =>
                      handlePecaChange(index, "nome", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Qtd"
                    className="border p-2 rounded w-full"
                    value={peca.quantidade}
                    onChange={(e) =>
                      handlePecaChange(index, "quantidade", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Valor Unitário"
                    className="border p-2 rounded w-full"
                    value={peca.valor}
                    onChange={(e) =>
                      handlePecaChange(index, "valor", e.target.value)
                    }
                  />
                </div>
                <div className="flex">
                  <input
                    type="number"
                    placeholder="Mão de Obra"
                    className="border p-2 rounded"
                    value={peca.maoDeObra}
                    onChange={(e) =>
                      handlePecaChange(index, "maoDeObra", e.target.value)
                    }
                  />
                  <button
                    onClick={() => removePeca(index)}
                    className="flex items-center gap-2 px-4 rounded-full mx-4 bg-red-100 text-red-500 hover:underline"
                  >
                    <Trash2 />
                    Remover
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={addPeca}
              className="text-blue-600 mt-2 hover:underline"
            >
              + Adicionar peça
            </button>
          </div>
        </div>

        {/* Totais */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Resumo financeiro</h3>
          <div className="flex flex-col">
            <div className="flex w-1/2 justify-between items-center">
              <div>
                <p className="text-gray-700 font-medium">Total das peças:</p>
                <p className="text-xl font-bold text-gray-800">
                  R$ {totalPecas.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-700 font-medium mt-2">
                  Total mão de obra:
                </p>
                <p className="text-xl font-bold text-gray-800">
                  R$ {totalMaoDeObra.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="text-end">
              <p className="text-gray-700 font-medium mt-2">Total geral:</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totalGeral.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded shadow"
          onClick={gerarPDF}
        >
          Gerar PDF
        </button>
      </div>
    </div>
  );
}

export default Orcamento;
