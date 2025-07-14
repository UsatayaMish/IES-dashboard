import { useState, useEffect } from "react";
import "./App.css";
import type { UES } from "./types/UES";
import InteractiveBlock from "./components/InteractiveBlock";
import ObjectModal from "./components/modal/ObjectModal";
import useUESData from "./hooks/useUESData";
import Header from "./components/header/Header";
import { useSimulationMode } from "./hooks/useSimulationMode";

function App() {
  const { isSimulationMode } = useSimulationMode();

  const [uesData, refetchUESData] = useUESData({ isSimulationMode });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUES, setSelectedUES] = useState<UES | null>(null);

  const handleBlockClick = (id: number | string) => {
    const data = uesData.find((item) => item.id === id);
    if (data) {
      setSelectedUES(data);
      setIsModalOpen(true);
    } else {
      console.warn(`Объект с ID ${id} не найден в данных.`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUES(null);
  };

  useEffect(() => {
    if (isModalOpen && selectedUES) {
      const updatedSelectedUES = uesData.find(
        (item) => item.id === selectedUES.id
      );
      if (updatedSelectedUES && updatedSelectedUES !== selectedUES) {
        setSelectedUES(updatedSelectedUES);
      }
    }
  }, [uesData, isModalOpen, selectedUES]);

  if (uesData.length === 0) {
    return <div className="loading-screen">Загрузка данных...</div>;
  }

  return (
    <>
      <Header onDataReset={refetchUESData} />
      <main className="main-content-wrapper">
        <div className="grid-container">
          <InteractiveBlock
            data={uesData.find((item) => item.id === 1)!}
            className="item-1"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 2)!}
            className="item-2"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 3)!}
            className="item-3"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 4)!}
            className="item-4"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 5)!}
            className="item-5"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 6)!}
            className="item-6"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 7)!}
            className="item-7"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 8)!}
            className="item-aek-tites"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 9)!}
            className="item-aek-prom"
            onClick={handleBlockClick}
          />
          <InteractiveBlock
            data={uesData.find((item) => item.id === 10)!}
            className="item-aek-viz"
            onClick={handleBlockClick}
          />
        </div>
      </main>
      <ObjectModal
        isOpen={isModalOpen}
        data={selectedUES}
        onClose={handleCloseModal}
        onDataUpdated={refetchUESData}
      ></ObjectModal>
    </>
  );
}

export default App;
