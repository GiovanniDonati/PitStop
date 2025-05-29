function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100 grow">
      <div className="flex flex-col p-8 grow">
        <h2 className="text-3xl font-semibold mb-4">Dashboard - Mecânica</h2>
        <p className="text-gray-600 mb-8">
          Acompanhe os veículos no pátio, manutenções em andamento e o resumo
          financeiro.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow grow">
            <h3 className="text-gray-500">Veículos Aguardando</h3>
            <p className="text-2xl font-bold">18</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow grow">
            <h3 className="text-gray-500">Em Manutenções</h3>
            <p className="text-2xl font-bold">7</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow grow">
            <h3 className="text-gray-500">Finalizados Hoje</h3>
            <p className="text-2xl font-bold">5</p>
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div className="bg-white p-6 rounded-lg shadow mb-8 w-2/3">
            <h3 className="text-lg font-semibold mb-4">
              Veículos em Manutenção
            </h3>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Modelo</th>
                  <th>Serviço</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    placa: "ABC-1234",
                    modelo: "Gol 1.6",
                    servico: "Troca de óleo",
                    status: "Em andamento",
                  },
                  {
                    placa: "XYZ-5678",
                    modelo: "Fiesta 1.0",
                    servico: "Revisão geral",
                    status: "Aguardando peças",
                  },
                  {
                    placa: "DEF-9012",
                    modelo: "Uno 1.4",
                    servico: "Freios",
                    status: "Finalizado",
                  },
                ].map((v, i) => (
                  <tr key={i} className="border-t">
                    <td>{v.placa}</td>
                    <td>{v.modelo}</td>
                    <td>{v.servico}</td>
                    <td>
                      <span
                        className={`font-semibold ${
                          v.status === "Finalizado"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-8 flex flex-col grow">
            <h3 className="text-lg font-semibold mb-4">
              Manutenções - Últimos 7 dias
            </h3>
            <div className="flex items-end space-x-2 h-full max-h-64">
              {[5, 8, 6, 7, 9, 4, 10].map((value, index) => (
                <div
                  key={index}
                  className="bg-yellow-500 rounded w-8"
                  style={{ height: `${value * 10}px` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
