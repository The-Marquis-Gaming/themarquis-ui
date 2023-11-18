import SlotNumber, { SlotNumberProps } from "../RouletteNumber/SlotNumber";

interface ChosenNumbersProps extends SlotNumberProps {
  eraseMode: boolean;
  setData: Function; // Agrega la propiedad 'setData' al tipo ChosenNumbersProps
  slots: any[]; // Agrega la propiedad 'slots' al tipo ChosenNumbersProps
}

function ChosenNumbers(props: ChosenNumbersProps) {
  const { setData, slots, eraseMode } = props;

  const chosenNumbers = [30, 20, 11, 17, 33, 18, 35, 33, 27, 18, 29, 29, 27, 21, 23, 14, 16, 7, 2];
  const contenidoRenderizado = slots.map((elemento: any, index: number) => {
    if (chosenNumbers.includes(index)) {
      return (
        <SlotNumber
          background={elemento.color}
          key={index}
          slots={[]}
          index={index}
          setData={setData}
          eraseMode={eraseMode} // Asegúrate de incluir eraseMode aquí
        >
          {index}
        </SlotNumber>
      );
    }
    return null;
  });

  return <div className="flex">{contenidoRenderizado}</div>;
}

export default ChosenNumbers;
