// import type React from "react";
// import type { UES } from "../../types/UES";
// import { useEffect, useRef, useState, useMemo } from "react";
// import { createPortal } from "react-dom";
// import {
//   updateUESData,
//   type UESUpdatePayload,
// } from "../../services/apiService";
// import { useSimulationMode } from "../../hooks/useSimulationMode";

// interface ObjectModalProps {
//   data: UES | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onDataUpdated: () => void;
// }

// const UES_API_BASE_URL = "http://192.168.0.153:5154/api/ues/update/region";

// const ObjectModal: React.FC<ObjectModalProps> = ({
//   data,
//   isOpen,
//   onClose,
//   onDataUpdated,
// }) => {
//   const dialogRef = useRef<HTMLDialogElement>(null);

//   const { isSimulationMode } = useSimulationMode();

//   const [editedConsumedCapacity, setEditedConsumedCapacity] = useState<
//     number | null
//   >(null);

//   const [editedNpP_capacity, setEditedNpP_capacity] = useState<number | null>(
//     null
//   );
//   const [editedHpP_capacity, setEditedHpP_capacity] = useState<number | null>(
//     null
//   );
//   const [editedCgpP_capacity, setEditedCgpP_capacity] = useState<number | null>(
//     null
//   );
//   const [editedWpP_capacity, setEditedWpP_capacity] = useState<number | null>(
//     null
//   );
//   const [editedSpP_capacity, setEditedSpP_capacity] = useState<number | null>(
//     null
//   );

//   const [editedFirstPercentage, setEditedFirstPercentage] = useState<number>(0);
//   const [editedSecondPercentage, setEditedSecondPercentage] =
//     useState<number>(0);
//   const [editedThirdPercentage, setEditedThirdPercentage] = useState<number>(0);

//   const [consumedCapacityError, setConsumedCapacityError] = useState<
//     string | null
//   >(null);
//   const [npPCapacityError, setNpPCapacityError] = useState<string | null>(null);
//   const [hpPCapacityError, setHpPCapacityError] = useState<string | null>(null);
//   const [cgpPCapacityError, setCgpPCapacityError] = useState<string | null>(
//     null
//   );
//   const [wpPCapacityError, setWpPCapacityError] = useState<string | null>(null);
//   const [spPCapacityError, setSpPCapacityError] = useState<string | null>(null);
//   const [consumerPercentagesError, setConsumerPercentagesError] = useState<
//     string | null
//   >(null);

//   useEffect(() => {
//     if (data) {
//       setEditedConsumedCapacity(data.consumedCapacity);

//       setEditedFirstPercentage(data.consumer.firstPercentage);
//       setEditedSecondPercentage(data.consumer.secondPercentage);
//       setEditedThirdPercentage(data.consumer.thirdPercentage);

//       setConsumedCapacityError(null);
//       setNpPCapacityError(null);
//       setHpPCapacityError(null);
//       setCgpPCapacityError(null);
//       setWpPCapacityError(null);
//       setSpPCapacityError(null);
//       setConsumerPercentagesError(null);
//     }
//   }, [data]);

//   useEffect(() => {
//     if (dialogRef.current) {
//       if (isOpen) {
//         dialogRef.current.showModal();
//       } else {
//         dialogRef.current.close();
//       }
//     }
//   }, [isOpen]);

//   const isFormValid = useMemo(() => {
//     return (
//       !consumedCapacityError &&
//       !npPCapacityError &&
//       !hpPCapacityError &&
//       !cgpPCapacityError &&
//       !wpPCapacityError &&
//       !spPCapacityError &&
//       !consumerPercentagesError // Добавляем проверку на ошибку процентов потребителей
//     );
//   }, [
//     consumedCapacityError,
//     npPCapacityError,
//     hpPCapacityError,
//     cgpPCapacityError,
//     wpPCapacityError,
//     spPCapacityError,
//     consumerPercentagesError,
//   ]);

//   useEffect(() => {
//     const dialogElement = dialogRef.current;
//     if (!dialogElement) return;

//     const handleDialogClose = () => {
//       onClose();
//     };

//     dialogElement.addEventListener("close", handleDialogClose);

//     return () => {
//       dialogElement.removeEventListener("close", handleDialogClose);
//     };
//   }, [onClose]);

//   if (!isOpen || !data) {
//     return null;
//   }

//   const modalRoot = document.getElementById("modal-root");
//   if (!modalRoot) {
//     console.error("Элемент #modal-root не найден в index.html");
//     return null;
//   }

//   const handleNumberInputChange = (
//     setter: React.Dispatch<React.SetStateAction<number | null>>,
//     errorSetter: React.Dispatch<React.SetStateAction<string | null>>,
//     value: string
//   ) => {
//     if (value === "") {
//       setter(null); // Если поле пустое, устанавливаем null
//       errorSetter(null); // Очищаем ошибку
//     } else {
//       const numValue = Number(value);
//       if (isNaN(numValue)) {
//         setter(numValue); // Устанавливаем NaN для некорректного ввода
//         errorSetter("Введите корректное число.");
//       } else if (numValue < 0) {
//         setter(numValue);
//         errorSetter("Число не может быть отрицательным.");
//       } else {
//         setter(numValue);
//         errorSetter(null); // Очищаем ошибку, если число валидно
//       }
//     }
//   };

//   const handleConsumerPercentageChange = (
//     setter: React.Dispatch<React.SetStateAction<number>>,
//     newValue: number,
//     currentId: "first" | "second" | "third"
//   ) => {
//     const clampedNewValue = Math.max(0, Math.min(100, newValue));

//     let sumOthers = 0;
//     if (currentId === "first") {
//       sumOthers = editedSecondPercentage + editedThirdPercentage;
//     } else if (currentId === "second") {
//       sumOthers = editedFirstPercentage + editedThirdPercentage;
//     } else {
//       // currentId === 'third'
//       sumOthers = editedFirstPercentage + editedSecondPercentage;
//     }

//     const availableForCurrent = 100 - sumOthers;

//     const finalValue = Math.min(clampedNewValue, availableForCurrent);
//     setter(finalValue);
//   };

//   const handleSaveChanges = async () => {
//     if (!data) return;

//     const calculatedConsumerTotal =
//       editedFirstPercentage + editedSecondPercentage + editedThirdPercentage;

//     if (calculatedConsumerTotal > 100) {
//       alert(
//         `Сумма процентов потребителей превышает 100%! Текущая сумма: ${calculatedConsumerTotal}. Пожалуйста, скорректируйте.`
//       );
//       return;
//     }

//     const updatedFields: UESUpdatePayload = {
//       consumedCapacity: editedConsumedCapacity ?? 0,
//       powerSource: {
//         id: data.powerSource.id,
//         npP_capacity: editedNpP_capacity ?? 0,
//         hpP_capacity: editedHpP_capacity ?? 0,
//         cgpP_capacity: editedCgpP_capacity ?? 0,
//         wpP_capacity: editedWpP_capacity ?? 0,
//         spP_capacity: editedSpP_capacity ?? 0,
//       },
//       consumer: {
//         id: data.consumer.id,
//         firstPercentage: editedFirstPercentage,
//         secondPercentage: editedSecondPercentage,
//         thirdPercentage: 100 - editedFirstPercentage - editedSecondPercentage,
//       },
//     };

//     try {
//       const updatedUES = await updateUESData(
//         UES_API_BASE_URL,
//         data.id,
//         updatedFields
//       );
//       console.log("Данные успешно обновлены на бэкенде:", updatedUES);
//       alert("Данные успешно обновлены!");
//       onDataUpdated();
//       onClose();
//     } catch (error) {
//       console.error("Ошибка при обновлении данных:", error);
//       alert("Не удалось обновить данные. Проверьте консоль.");
//     }
//   };

//   return createPortal(
//     <dialog ref={dialogRef} className="modal" style={{ maxWidth: "unset" }}>
//       <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
//         {/* Левая колонка: отображение данных */}
//         <div style={{ flex: 1, minWidth: "250px" }}>
//           <h2>Детали: {data.name}</h2>
//           <p>ID: {data.id}</p>
//           <p>Статус: {data.status}</p>
//           <p>Произведено: {data.producedCapacity}</p>
//           <p>Потреблено: {data.consumedCapacity}</p>
//           <div>
//             <h4>Источники энергии:</h4>
//             <ul>
//               <li>АЭС: {data.powerSource.npP_Percentage.toPrecision(3)} %</li>{" "}
//               {/* Отображаем из data.powerSource.npP_Percentage */}
//               <li>ГЭС: {data.powerSource.hpP_Percentage.toPrecision(3)} %</li>
//               <li>ТЭС: {data.powerSource.cgpP_Percentage.toPrecision(3)} %</li>
//               <li>ВЭС: {data.powerSource.wpP_Percentage.toPrecision(3)} %</li>
//               <li>СЭС: {data.powerSource.spP_Percentage.toPrecision(3)} %</li>
//             </ul>
//           </div>
//           <div>
//             <h4>Потребители:</h4>
//             <ul>
//               <li>Первый: {data.consumer.firstPercentage}%</li>
//               <li>Второй: {data.consumer.secondPercentage}%</li>
//               <li>Третий: {data.consumer.thirdPercentage}%</li>
//             </ul>
//           </div>
//           <p>Временная зона (смещение): {data.timeZoneOffset}</p>
//           <button onClick={onClose} style={{ marginTop: "20px" }}>
//             Закрыть
//           </button>
//         </div>

//         {/* Правая колонка: форма для обновления данных */}

//         {!isSimulationMode && (
//           <div
//             style={{
//               flex: 1,
//               minWidth: "300px",
//               borderLeft: "1px solid #eee",
//               paddingLeft: "20px",
//             }}
//           >
//             <h2>Обновить данные</h2>
//             {/* Поле для Consumed Capacity */}
//             <div style={{ marginBottom: "10px" }}>
//               <label htmlFor="consumedCapacity">Потреблено ( ГВт):</label>
//               <input
//                 id="consumedCapacity"
//                 type="number"
//                 value={
//                   editedConsumedCapacity === null ? "" : editedConsumedCapacity
//                 }
//                 onChange={(e) =>
//                   handleNumberInputChange(
//                     setEditedConsumedCapacity,
//                     setConsumedCapacityError,
//                     e.target.value
//                   )
//                 }
//                 style={{
//                   width: "100%",
//                   padding: "8px",
//                   margin: "5px 0",
//                   borderColor: consumedCapacityError ? "red" : "",
//                   borderWidth: consumedCapacityError ? "2px" : "1px",
//                   borderStyle: "solid",
//                 }}
//               />
//               {consumedCapacityError && (
//                 <span style={{ color: "red", fontSize: "0.8em" }}>
//                   {consumedCapacityError}
//                 </span>
//               )}
//             </div>

//             {/* Поля для мощностей электростанций */}
//             <h4>Мощности источников энергии (ГВт):</h4>
//             <div style={{ marginBottom: "10px" }}>
//               <label htmlFor="npP_capacity">АЭС (ГВт):</label>
//               <input
//                 id="npP_capacity"
//                 type="number"
//                 value={editedNpP_capacity === null ? "" : editedNpP_capacity}
//                 onChange={(e) =>
//                   handleNumberInputChange(
//                     setEditedNpP_capacity,
//                     setNpPCapacityError,
//                     e.target.value
//                   )
//                 }
//                 style={{
//                   width: "100%",
//                   padding: "8px",
//                   margin: "5px 0",
//                   borderColor: npPCapacityError ? "red" : "",
//                   borderWidth: npPCapacityError ? "2px" : "1px",
//                   borderStyle: "solid",
//                 }}
//               />
//               {npPCapacityError && (
//                 <span style={{ color: "red", fontSize: "0.8em" }}>
//                   {npPCapacityError}
//                 </span>
//               )}
//             </div>
//             <div style={{ marginBottom: "10px" }}>
//               <label htmlFor="hpP_capacity">ГЭС (ГВт):</label>
//               <input
//                 id="hpP_capacity"
//                 type="number"
//                 value={editedHpP_capacity === null ? "" : editedHpP_capacity}
//                 onChange={(e) =>
//                   handleNumberInputChange(
//                     setEditedHpP_capacity,
//                     setHpPCapacityError,
//                     e.target.value
//                   )
//                 }
//                 style={{
//                   width: "100%",
//                   padding: "8px",
//                   margin: "5px 0",
//                   borderColor: hpPCapacityError ? "red" : "",
//                   borderWidth: hpPCapacityError ? "2px" : "1px",
//                   borderStyle: "solid",
//                 }}
//               />
//               {hpPCapacityError && (
//                 <span style={{ color: "red", fontSize: "0.8em" }}>
//                   {hpPCapacityError}
//                 </span>
//               )}
//             </div>
//             <div style={{ marginBottom: "10px" }}>
//               <label htmlFor="cgpP_capacity">ТЭС (ГВт):</label>
//               <input
//                 id="cgpP_capacity"
//                 type="number"
//                 value={editedCgpP_capacity === null ? "" : editedCgpP_capacity}
//                 onChange={(e) =>
//                   handleNumberInputChange(
//                     setEditedCgpP_capacity,
//                     setCgpPCapacityError,
//                     e.target.value
//                   )
//                 }
//                 style={{
//                   width: "100%",
//                   padding: "8px",
//                   margin: "5px 0",
//                   borderColor: cgpPCapacityError ? "red" : "",
//                   borderWidth: cgpPCapacityError ? "2px" : "1px",
//                   borderStyle: "solid",
//                 }}
//               />
//               {cgpPCapacityError && (
//                 <span style={{ color: "red", fontSize: "0.8em" }}>
//                   {cgpPCapacityError}
//                 </span>
//               )}
//             </div>
//             <div style={{ marginBottom: "10px" }}>
//               <label htmlFor="wpP_capacity">ВЭС (ГВт):</label>
//               <input
//                 id="wpP_capacity"
//                 type="number"
//                 value={editedWpP_capacity === null ? "" : editedWpP_capacity}
//                 onChange={(e) =>
//                   handleNumberInputChange(
//                     setEditedWpP_capacity,
//                     setWpPCapacityError,
//                     e.target.value
//                   )
//                 }
//                 style={{
//                   width: "100%",
//                   padding: "8px",
//                   margin: "5px 0",
//                   borderColor: wpPCapacityError ? "red" : "",
//                   borderWidth: wpPCapacityError ? "2px" : "1px",
//                   borderStyle: "solid",
//                 }}
//               />
//               {wpPCapacityError && (
//                 <span style={{ color: "red", fontSize: "0.8em" }}>
//                   {wpPCapacityError}
//                 </span>
//               )}
//             </div>
//             <div style={{ marginBottom: "10px" }}>
//               <label htmlFor="spP_capacity">СЭС (ГВт):</label>
//               <input
//                 id="spP_capacity"
//                 type="number"
//                 value={editedSpP_capacity === null ? "" : editedSpP_capacity}
//                 onChange={(e) =>
//                   handleNumberInputChange(
//                     setEditedSpP_capacity,
//                     setSpPCapacityError,
//                     e.target.value
//                   )
//                 }
//                 style={{
//                   width: "100%",
//                   padding: "8px",
//                   margin: "5px 0",
//                   borderColor: spPCapacityError ? "red" : "",
//                   borderWidth: spPCapacityError ? "2px" : "1px",
//                   borderStyle: "solid",
//                 }}
//               />
//               {spPCapacityError && (
//                 <span style={{ color: "red", fontSize: "0.8em" }}>
//                   {spPCapacityError}
//                 </span>
//               )}
//             </div>
//             <p style={{ fontWeight: "bold" }}>
//               Сумма мощностей:{" "}
//               {(editedNpP_capacity ?? 0) +
//                 (editedHpP_capacity ?? 0) +
//                 (editedCgpP_capacity ?? 0) +
//                 (editedWpP_capacity ?? 0) +
//                 (editedSpP_capacity ?? 0)}{" "}
//               ГВт
//             </p>

//             {/* Слайдеры для потребителей */}
//             <h4>Проценты потребителей (%):</h4>
//             <div style={{ marginBottom: "10px" }}>
//               <label htmlFor="firstPercentage">
//                 Первый ({editedFirstPercentage}%):
//               </label>
//               <input
//                 id="firstPercentage"
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={editedFirstPercentage}
//                 onChange={(e) =>
//                   handleConsumerPercentageChange(
//                     setEditedFirstPercentage,
//                     Number(e.target.value),
//                     "first"
//                   )
//                 }
//                 style={{ width: "100%", margin: "5px 0" }}
//               />
//             </div>
//             <div style={{ marginBottom: "10px" }}>
//               <label htmlFor="secondPercentage">
//                 Второй ({editedSecondPercentage}%):
//               </label>
//               <input
//                 id="secondPercentage"
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={editedSecondPercentage}
//                 onChange={(e) =>
//                   handleConsumerPercentageChange(
//                     setEditedSecondPercentage,
//                     Number(e.target.value),
//                     "second"
//                   )
//                 }
//                 style={{ width: "100%", margin: "5px 0" }}
//               />
//             </div>
//             <div style={{ marginBottom: "10px" }}>
//               <label htmlFor="thirdPercentage">
//                 Третий ({editedThirdPercentage}%):
//               </label>
//               <input
//                 id="thirdPercentage"
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={editedThirdPercentage}
//                 onChange={(e) =>
//                   handleConsumerPercentageChange(
//                     setEditedThirdPercentage,
//                     Number(e.target.value),
//                     "third"
//                   )
//                 }
//                 style={{ width: "100%", margin: "5px 0" }}
//               />
//             </div>
//             <p style={{ fontWeight: "bold" }}>
//               Сумма потребителей:{" "}
//               {editedFirstPercentage +
//                 editedSecondPercentage +
//                 editedThirdPercentage}
//               %
//             </p>
//             {consumerPercentagesError && (
//               <span style={{ color: "red", fontSize: "0.8em" }}>
//                 {consumerPercentagesError}
//               </span>
//             )}

//             <button
//               onClick={handleSaveChanges}
//               style={{
//                 backgroundColor: "#007bff",
//                 color: "white",
//                 marginTop: "15px",
//               }}
//               disabled={!isFormValid || isSimulationMode} // Кнопка неактивна, если форма не валидна или в режиме симуляции
//             >
//               Сохранить изменения
//             </button>
//           </div>
//         )}
//       </div>
//     </dialog>,
//     modalRoot
//   );
// };

// export default ObjectModal;
import type React from "react";
import type { UES } from "../../types/UES";
import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  updateUESData,
  type UESUpdatePayload,
} from "../../services/apiService";
import { useSimulationMode } from "../../hooks/useSimulationMode";

interface ObjectModalProps {
  data: UES | null;
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
}

const UES_API_BASE_URL = "http://localhost:5154/api/ues/update/region";

const ObjectModal: React.FC<ObjectModalProps> = ({
  data,
  isOpen,
  onClose,
  onDataUpdated,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { isSimulationMode } = useSimulationMode();

  const [editedConsumedCapacity, setEditedConsumedCapacity] = useState<
    number | null
  >(null);

  const [editedNpP_capacity, setEditedNpP_capacity] = useState<number | null>(
    null
  );
  const [editedHpP_capacity, setEditedHpP_capacity] = useState<number | null>(
    null
  );
  const [editedCgpP_capacity, setEditedCgpP_capacity] = useState<number | null>(
    null
  );
  const [editedWpP_capacity, setEditedWpP_capacity] = useState<number | null>(
    null
  );
  const [editedSpP_capacity, setEditedSpP_capacity] = useState<number | null>(
    null
  );

  const [editedFirstPercentage, setEditedFirstPercentage] = useState<number>(0);
  const [editedSecondPercentage, setEditedSecondPercentage] =
    useState<number>(0);
  const [editedThirdPercentage, setEditedThirdPercentage] = useState<number>(0);

  const [consumedCapacityError, setConsumedCapacityError] = useState<
    string | null
  >(null);
  const [npPCapacityError, setNpPCapacityError] = useState<string | null>(null);
  const [hpPCapacityError, setHpPCapacityError] = useState<string | null>(null);
  const [cgpPCapacityError, setCgpPCapacityError] = useState<string | null>(
    null
  );
  const [wpPCapacityError, setWpPCapacityError] = useState<string | null>(null);
  const [spPCapacityError, setSpPCapacityError] = useState<string | null>(null);
  const [consumerPercentagesError, setConsumerPercentagesError] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (data) {
      setEditedConsumedCapacity(data.consumedCapacity);

      setEditedFirstPercentage(data.consumer.firstPercentage);
      setEditedSecondPercentage(data.consumer.secondPercentage);
      setEditedThirdPercentage(data.consumer.thirdPercentage);

      setConsumedCapacityError(null);
      setNpPCapacityError(null);
      setHpPCapacityError(null);
      setCgpPCapacityError(null);
      setWpPCapacityError(null);
      setSpPCapacityError(null);
      setConsumerPercentagesError(null);
    }
  }, [data]);

  useEffect(() => {
    if (dialogRef.current) {
      if (isOpen) {
        dialogRef.current.showModal();
      } else {
        dialogRef.current.close();
      }
    }
  }, [isOpen]);

  const isFormValid = useMemo(() => {
    const totalConsumerPercentage =
      editedFirstPercentage + editedSecondPercentage + editedThirdPercentage;
    const consumerPercentagesValid = totalConsumerPercentage === 100;
    if (!consumerPercentagesValid) {
      setConsumerPercentagesError(
        "Сумма процентов потребителей должна быть равна 100%."
      );
    } else {
      setConsumerPercentagesError(null);
    }

    return (
      !consumedCapacityError &&
      !npPCapacityError &&
      !hpPCapacityError &&
      !cgpPCapacityError &&
      !wpPCapacityError &&
      !spPCapacityError &&
      consumerPercentagesValid
    );
  }, [
    consumedCapacityError,
    npPCapacityError,
    hpPCapacityError,
    cgpPCapacityError,
    wpPCapacityError,
    spPCapacityError,
    editedFirstPercentage,
    editedSecondPercentage,
    editedThirdPercentage,
  ]);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    const handleDialogClose = () => {
      onClose();
    };

    dialogElement.addEventListener("close", handleDialogClose);

    return () => {
      dialogElement.removeEventListener("close", handleDialogClose);
    };
  }, [onClose]);

  if (!isOpen || !data) {
    return null;
  }

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    console.error("Элемент #modal-root не найден в index.html");
    return null;
  }

  const handleNumberInputChange = (
    setter: React.Dispatch<React.SetStateAction<number | null>>,
    errorSetter: React.Dispatch<React.SetStateAction<string | null>>,
    value: string
  ) => {
    if (value === "") {
      setter(null);
      errorSetter(null);
    } else {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        setter(numValue);
        errorSetter("Введите корректное число.");
      } else if (numValue < 0) {
        setter(numValue);
        errorSetter("Число не может быть отрицательным.");
      } else {
        setter(numValue);
        errorSetter(null);
      }
    }
  };

  const handleConsumerPercentageChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    newValue: number,
    currentId: "first" | "second" | "third"
  ) => {
    const clampedNewValue = Math.max(0, Math.min(100, newValue));

    let sumOthers = 0;
    if (currentId === "first") {
      sumOthers = editedSecondPercentage + editedThirdPercentage;
    } else if (currentId === "second") {
      sumOthers = editedFirstPercentage + editedThirdPercentage;
    } else {
      sumOthers = editedFirstPercentage + editedSecondPercentage;
    }

    const availableForCurrent = 100 - sumOthers;

    const finalValue = Math.min(clampedNewValue, availableForCurrent);
    setter(finalValue);
  };

  const handleSaveChanges = async () => {
    if (!data) return;

    const calculatedConsumerTotal =
      editedFirstPercentage + editedSecondPercentage + editedThirdPercentage;

    if (calculatedConsumerTotal !== 100) {
      alert(
        `Сумма процентов потребителей должна быть равна 100%! Текущая сумма: ${calculatedConsumerTotal}. Пожалуйста, скорректируйте.`
      );
      return;
    }

    const updatedFields: UESUpdatePayload = {
      consumedCapacity: editedConsumedCapacity ?? 0,
      powerSource: {
        id: data.powerSource.id,
        npP_capacity: editedNpP_capacity ?? 0,
        hpP_capacity: editedHpP_capacity ?? 0,
        cgpP_capacity: editedCgpP_capacity ?? 0,
        wpP_capacity: editedWpP_capacity ?? 0,
        spP_capacity: editedSpP_capacity ?? 0,
      },
      consumer: {
        id: data.consumer.id,
        firstPercentage: editedFirstPercentage,
        secondPercentage: editedSecondPercentage,
        thirdPercentage: editedThirdPercentage,
      },
    };

    try {
      const updatedUES = await updateUESData(
        UES_API_BASE_URL,
        data.id,
        updatedFields
      );
      console.log("Данные успешно обновлены на бэкенде:", updatedUES);
      onDataUpdated();
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
      alert("Не удалось обновить данные. Проверьте консоль.");
    }
  };

  const getStatusColor = (status: UES["status"]) => {
    switch (status) {
      case true:
        return "#4CAF50";
      case false:
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      style={{
        border: "none",
        padding: "0",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#f8f9fa",
        maxWidth: "900px",
        width: "90%",
        maxHeight: "90vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "30px",
          display: "flex",
          gap: "30px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            padding: "25px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
          }}
        >
          <h2
            style={{
              color: "#333",
              marginBottom: "20px",
              borderBottom: "2px solid #e0e0e0",
              paddingBottom: "10px",
            }}
          >
            Детали: {data.name}
          </h2>
          <p style={{ marginBottom: "8px", color: "#333", fontWeight: "bold" }}>
            <strong style={{ color: "#555" }}>ID:</strong> {data.id}
          </p>
          <p style={{ marginBottom: "8px", color: "#333", fontWeight: "bold" }}>
            <strong style={{ color: "#555" }}>Статус:</strong>{" "}
            <span
              style={{
                color: getStatusColor(data.status),
                fontWeight: "bold",
              }}
            >
              {data.status ? "Активен" : "Неактивен"}
            </span>
          </p>
          <p style={{ marginBottom: "8px", color: "#333", fontWeight: "bold" }}>
            <strong style={{ color: "#555" }}>Произведено:</strong>{" "}
            {data.producedCapacity} ГВт
          </p>
          <p
            style={{ marginBottom: "20px", color: "#333", fontWeight: "bold" }}
          >
            <strong style={{ color: "#555" }}>
              {!isSimulationMode
                ? "Потреблено за год:"
                : "Потреблено за шаг симуляции:"}
            </strong>{" "}
            {data.consumedCapacity} {!isSimulationMode ? "млрд КВт*ч" : "ГВт"}
          </p>

          <h4
            style={{
              color: "#444",
              marginBottom: "15px",
              borderBottom: "1px solid #f0f0f0",
              paddingBottom: "5px",
            }}
          >
            Источники энергии:
          </h4>
          <ul style={{ listStyle: "none", padding: "0" }}>
            <li
              style={{ marginBottom: "5px", color: "#333", fontWeight: "bold" }}
            >
              АЭС:{" "}
              <strong style={{ color: "#007bff" }}>
                {data.powerSource.npP_Percentage.toFixed(2)} %
              </strong>
            </li>
            <li
              style={{ marginBottom: "5px", color: "#333", fontWeight: "bold" }}
            >
              ГЭС:{" "}
              <strong style={{ color: "#007bff" }}>
                {data.powerSource.hpP_Percentage.toFixed(2)} %
              </strong>
            </li>
            <li
              style={{ marginBottom: "5px", color: "#333", fontWeight: "bold" }}
            >
              ТЭС:{" "}
              <strong style={{ color: "#007bff" }}>
                {data.powerSource.cgpP_Percentage.toFixed(2)} %
              </strong>
            </li>
            <li
              style={{ marginBottom: "5px", color: "#333", fontWeight: "bold" }}
            >
              ВЭС:{" "}
              <strong style={{ color: "#007bff" }}>
                {data.powerSource.wpP_Percentage.toFixed(2)} %
              </strong>
            </li>
            <li
              style={{
                marginBottom: "10px",
                color: "#333",
                fontWeight: "bold",
              }}
            >
              СЭС:{" "}
              <strong style={{ color: "#007bff" }}>
                {data.powerSource.spP_Percentage.toFixed(2)} %
              </strong>
            </li>
          </ul>

          <h4
            style={{
              color: "#444",
              marginBottom: "15px",
              borderBottom: "1px solid #f0f0f0",
              paddingBottom: "5px",
            }}
          >
            Потребители:
          </h4>
          <ul style={{ listStyle: "none", padding: "0" }}>
            <li
              style={{ marginBottom: "5px", color: "#333", fontWeight: "bold" }}
            >
              Первый:{" "}
              <strong style={{ color: "#007bff" }}>
                {data.consumer.firstPercentage}%
              </strong>
            </li>
            <li
              style={{ marginBottom: "5px", color: "#333", fontWeight: "bold" }}
            >
              Второй:{" "}
              <strong style={{ color: "#007bff" }}>
                {data.consumer.secondPercentage}%
              </strong>
            </li>
            <li
              style={{
                marginBottom: "10px",
                color: "#333",
                fontWeight: "bold",
              }}
            >
              Третий:{" "}
              <strong style={{ color: "#007bff" }}>
                {data.consumer.thirdPercentage}%
              </strong>
            </li>
          </ul>
          <p
            style={{ marginBottom: "20px", color: "#333", fontWeight: "bold" }}
          >
            <strong style={{ color: "#555" }}>
              Временная зона (смещение):
            </strong>{" "}
            {`GMT+${data.timeZoneOffset}`}
          </p>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1em",
              transition: "background-color 0.2s ease-in-out",
            }}
          >
            Закрыть
          </button>
        </div>

        {!isSimulationMode && (
          <div
            style={{
              flex: 1,
              minWidth: "350px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              padding: "25px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
            }}
          >
            <h2
              style={{
                color: "#333",
                marginBottom: "20px",
                borderBottom: "2px solid #e0e0e0",
                paddingBottom: "10px",
              }}
            >
              Обновить данные
            </h2>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="consumedCapacity"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#222", // Изменен цвет текста лейбла, чтобы был еще темнее
                }}
              >
                Потреблено (ГВт):
              </label>
              <input
                id="consumedCapacity"
                type="number"
                value={
                  editedConsumedCapacity === null ? "" : editedConsumedCapacity
                }
                onChange={(e) =>
                  handleNumberInputChange(
                    setEditedConsumedCapacity,
                    setConsumedCapacityError,
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: `1px solid ${
                    consumedCapacityError ? "#dc3545" : "#ced4da"
                  }`,
                  boxShadow: consumedCapacityError
                    ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
                    : "none",
                  transition: "border-color 0.2s ease-in-out",
                  backgroundColor: "#eeeeee", // Изменен цвет фона инпута
                  color: "#333",
                }}
              />
              {consumedCapacityError && (
                <span style={{ color: "#dc3545", fontSize: "0.85em" }}>
                  {consumedCapacityError}
                </span>
              )}
            </div>

            <h4
              style={{
                color: "#444",
                marginBottom: "15px",
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: "5px",
              }}
            >
              Мощности источников энергии (ГВт):
            </h4>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="npP_capacity"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#222", // Изменен цвет текста лейбла
                }}
              >
                АЭС (ГВт):
              </label>
              <input
                id="npP_capacity"
                type="number"
                value={editedNpP_capacity === null ? "" : editedNpP_capacity}
                onChange={(e) =>
                  handleNumberInputChange(
                    setEditedNpP_capacity,
                    setNpPCapacityError,
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: `1px solid ${
                    npPCapacityError ? "#dc3545" : "#ced4da"
                  }`,
                  boxShadow: npPCapacityError
                    ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
                    : "none",
                  transition: "border-color 0.2s ease-in-out",
                  backgroundColor: "#eeeeee", // Изменен цвет фона инпута
                  color: "#333",
                }}
              />
              {npPCapacityError && (
                <span style={{ color: "#dc3545", fontSize: "0.85em" }}>
                  {npPCapacityError}
                </span>
              )}
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="hpP_capacity"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#222", // Изменен цвет текста лейбла
                }}
              >
                ГЭС (ГВт):
              </label>
              <input
                id="hpP_capacity"
                type="number"
                value={editedHpP_capacity === null ? "" : editedHpP_capacity}
                onChange={(e) =>
                  handleNumberInputChange(
                    setEditedHpP_capacity,
                    setHpPCapacityError,
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: `1px solid ${
                    hpPCapacityError ? "#dc3545" : "#ced4da"
                  }`,
                  boxShadow: hpPCapacityError
                    ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
                    : "none",
                  transition: "border-color 0.2s ease-in-out",
                  backgroundColor: "#eeeeee", // Изменен цвет фона инпута
                  color: "#333",
                }}
              />
              {hpPCapacityError && (
                <span style={{ color: "#dc3545", fontSize: "0.85em" }}>
                  {hpPCapacityError}
                </span>
              )}
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="cgpP_capacity"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#222", // Изменен цвет текста лейбла
                }}
              >
                ТЭС (ГВт):
              </label>
              <input
                id="cgpP_capacity"
                type="number"
                value={editedCgpP_capacity === null ? "" : editedCgpP_capacity}
                onChange={(e) =>
                  handleNumberInputChange(
                    setEditedCgpP_capacity,
                    setCgpPCapacityError,
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: `1px solid ${
                    cgpPCapacityError ? "#dc3545" : "#ced4da"
                  }`,
                  boxShadow: cgpPCapacityError
                    ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
                    : "none",
                  transition: "border-color 0.2s ease-in-out",
                  backgroundColor: "#eeeeee", // Изменен цвет фона инпута
                  color: "#333",
                }}
              />
              {cgpPCapacityError && (
                <span style={{ color: "#dc3545", fontSize: "0.85em" }}>
                  {cgpPCapacityError}
                </span>
              )}
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="wpP_capacity"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#222", // Изменен цвет текста лейбла
                }}
              >
                ВЭС (ГВт):
              </label>
              <input
                id="wpP_capacity"
                type="number"
                value={editedWpP_capacity === null ? "" : editedWpP_capacity}
                onChange={(e) =>
                  handleNumberInputChange(
                    setEditedWpP_capacity,
                    setWpPCapacityError,
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: `1px solid ${
                    wpPCapacityError ? "#dc3545" : "#ced4da"
                  }`,
                  boxShadow: wpPCapacityError
                    ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
                    : "none",
                  transition: "border-color 0.2s ease-in-out",
                  backgroundColor: "#eeeeee", // Изменен цвет фона инпута
                  color: "#333",
                }}
              />
              {wpPCapacityError && (
                <span style={{ color: "#dc3545", fontSize: "0.85em" }}>
                  {wpPCapacityError}
                </span>
              )}
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="spP_capacity"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#222", // Изменен цвет текста лейбла
                }}
              >
                СЭС (ГВт):
              </label>
              <input
                id="spP_capacity"
                type="number"
                value={editedSpP_capacity === null ? "" : editedSpP_capacity}
                onChange={(e) =>
                  handleNumberInputChange(
                    setEditedSpP_capacity,
                    setSpPCapacityError,
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  border: `1px solid ${
                    spPCapacityError ? "#dc3545" : "#ced4da"
                  }`,
                  boxShadow: spPCapacityError
                    ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
                    : "none",
                  transition: "border-color 0.2s ease-in-out",
                  backgroundColor: "#eeeeee", // Изменен цвет фона инпута
                  color: "#333",
                }}
              />
              {spPCapacityError && (
                <span style={{ color: "#dc3545", fontSize: "0.85em" }}>
                  {spPCapacityError}
                </span>
              )}
            </div>
            <p
              style={{
                fontWeight: "bold",
                color: "#333",
                marginBottom: "20px",
              }}
            >
              Сумма мощностей:{" "}
              <span style={{ color: "#007bff" }}>
                {(editedNpP_capacity ?? 0) +
                  (editedHpP_capacity ?? 0) +
                  (editedCgpP_capacity ?? 0) +
                  (editedWpP_capacity ?? 0) +
                  (editedSpP_capacity ?? 0)}{" "}
                ГВт
              </span>
            </p>

            <h4
              style={{
                color: "#444",
                marginBottom: "15px",
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: "5px",
              }}
            >
              Проценты потребителей (%):
            </h4>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="firstPercentage"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#222", // Изменен цвет текста лейбла
                }}
              >
                Первый ({editedFirstPercentage}%):
              </label>
              <input
                id="firstPercentage"
                type="range"
                min="0"
                max="100"
                value={editedFirstPercentage}
                onChange={(e) =>
                  handleConsumerPercentageChange(
                    setEditedFirstPercentage,
                    Number(e.target.value),
                    "first"
                  )
                }
                style={{
                  width: "100%",
                  margin: "5px 0",
                  backgroundColor: "#eeeeee",
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="secondPercentage"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#222", // Изменен цвет текста лейбла
                }}
              >
                Второй ({editedSecondPercentage}%):
              </label>
              <input
                id="secondPercentage"
                type="range"
                min="0"
                max="100"
                value={editedSecondPercentage}
                onChange={(e) =>
                  handleConsumerPercentageChange(
                    setEditedSecondPercentage,
                    Number(e.target.value),
                    "second"
                  )
                }
                style={{
                  width: "100%",
                  margin: "5px 0",
                  backgroundColor: "#eeeeee",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="thirdPercentage"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#222", // Изменен цвет текста лейбла
                }}
              >
                Третий ({editedThirdPercentage}%):
              </label>
              <input
                id="thirdPercentage"
                type="range"
                min="0"
                max="100"
                value={editedThirdPercentage}
                onChange={(e) =>
                  handleConsumerPercentageChange(
                    setEditedThirdPercentage,
                    Number(e.target.value),
                    "third"
                  )
                }
                style={{
                  width: "100%",
                  margin: "5px 0",
                  backgroundColor: "#eeeeee",
                }}
              />
            </div>
            <p
              style={{
                fontWeight: "bold",
                color: "#333",
                marginBottom: "15px",
              }}
            >
              Сумма потребителей:{" "}
              <span
                style={{
                  color:
                    editedFirstPercentage +
                      editedSecondPercentage +
                      editedThirdPercentage !==
                    100
                      ? "#dc3545"
                      : "#28a745",
                }}
              >
                {editedFirstPercentage +
                  editedSecondPercentage +
                  editedThirdPercentage}{" "}
                %
              </span>
            </p>
            {consumerPercentagesError && (
              <span
                style={{
                  color: "#dc3545",
                  fontSize: "0.85em",
                  display: "block",
                  marginBottom: "15px",
                }}
              >
                {consumerPercentagesError}
              </span>
            )}

            <button
              onClick={handleSaveChanges}
              style={{
                backgroundColor:
                  isFormValid && !isSimulationMode ? "#28a745" : "#6c757d",
                color: "white",
                padding: "12px 25px",
                border: "none",
                borderRadius: "5px",
                cursor:
                  isFormValid && !isSimulationMode ? "pointer" : "not-allowed",
                fontSize: "1.1em",
                fontWeight: "bold",
                marginTop: "15px",
                transition: "background-color 0.2s ease-in-out",
              }}
              disabled={!isFormValid || isSimulationMode}
            >
              Сохранить изменения
            </button>
          </div>
        )}
      </div>
    </dialog>,
    modalRoot
  );
};

export default ObjectModal;
