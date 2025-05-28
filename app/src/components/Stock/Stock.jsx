function Stock() {
  const produtos = [
    {
      id: 1,
      nome: "Óleo de Motor",
      descricao: "Lubrificante sintético de alta performance.",
      preco: "R$ 89,90",
      imagem:
        "https://media.istockphoto.com/id/488844774/vector/vector-car-spares-concept-with-disk-brake.jpg?s=612x612&w=0&k=20&c=xo4k3aNULzjskCD1JWwWCoplZnwHsTvYeD0TUhn9JWM=",
    },
    {
      id: 2,
      nome: "Filtro de Ar",
      descricao: "Filtro eficiente para motores a combustão.",
      preco: "R$ 49,90",
      imagem:
        "https://media.istockphoto.com/id/488844774/vector/vector-car-spares-concept-with-disk-brake.jpg?s=612x612&w=0&k=20&c=xo4k3aNULzjskCD1JWwWCoplZnwHsTvYeD0TUhn9JWM=",
    },
    {
      id: 3,
      nome: "Pneu Aro 15",
      descricao: "Pneu de alta durabilidade e desempenho.",
      preco: "R$ 399,90",
      imagem:
        "https://media.istockphoto.com/id/488844774/vector/vector-car-spares-concept-with-disk-brake.jpg?s=612x612&w=0&k=20&c=xo4k3aNULzjskCD1JWwWCoplZnwHsTvYeD0TUhn9JWM=",
    },
    {
      id: 4,
      nome: "Pastilha de Freio",
      descricao: "Pastilhas resistentes para frenagem segura.",
      preco: "R$ 129,90",
      imagem:
        "https://media.istockphoto.com/id/488844774/vector/vector-car-spares-concept-with-disk-brake.jpg?s=612x612&w=0&k=20&c=xo4k3aNULzjskCD1JWwWCoplZnwHsTvYeD0TUhn9JWM=",
    },
    {
      id: 5,
      nome: "Bateria 60Ah",
      descricao: "Bateria automotiva com longa duração.",
      preco: "R$ 459,90",
      imagem:
        "https://media.istockphoto.com/id/488844774/vector/vector-car-spares-concept-with-disk-brake.jpg?s=612x612&w=0&k=20&c=xo4k3aNULzjskCD1JWwWCoplZnwHsTvYeD0TUhn9JWM=",
    },
  ];

  return (
    <div className="h-screen p-8 bg-gray-100 grow">
      <h2 className="text-3xl font-bold mb-6">Produtos</h2>

      <div className="grid grid-cols-2 gap-4 overflow-y-scroll h-[calc(100vh-150px)]">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="bg-white rounded-lg shadow p-4 flex justify-between"
          >
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-40 h-40 object-cover rounded ml-4"
            />
            <div className="flex flex-col items-start mr-12">
              <h3 className="text-xl font-semibold">{produto.nome}</h3>
              <p className="text-gray-600">{produto.descricao}</p>
              <span className="text-green-600 font-bold mt-auto text-end w-full text-xl">
                {produto.preco}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stock;
