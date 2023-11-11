import SlotNumber from "../RouletteNumber/SlotNumber";
interface SlotNumberProps {
  setData: Function;
  slots: any[];
}

function ChosenNumbers(props: SlotNumberProps) {
  const { setData, slots } = props;

  const chosenNumbers = [
    30, 20, 11, 17, 33, 18, 35, 33, 27, 18, 29, 29, 27, 21, 23, 14, 16, 7, 2,
  ];
  const contenidoRenderizado = slots.map((elemento, index) => {
    if (chosenNumbers.includes(index)) {
      return (
        <SlotNumber
          background={elemento.color}
          key={index}
          slots={[]}
          index={index}
          setData={setData}
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
