function Financeiro() {
  return (
    <div className="flex h-screen bg-gray-100 grow">
      <div className="grid grid-cols-3 gap-4 grow mb-8 h-1/5 m-4">
        <div className="bg-white p-6 rounded-lg shadow grow">
          <h3 className="text-gray-500">Entrada</h3>
          <p className="text-2xl font-bold text-green-600">R$ 12.500</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow grow">
          <h3 className="text-gray-500">Saída</h3>
          <p className="text-2xl font-bold text-red-600">R$ 4.300</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow grow">
          <h3 className="text-gray-500">Lucro</h3>
          <p className="text-2xl font-bold text-blue-600">R$ 8.200</p>
        </div>
      </div>
    </div>
  );
}

export default Financeiro;
