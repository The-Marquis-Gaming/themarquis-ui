
interface RowsProps {
    slots: any[];
    setData: Function;
    valueChip?: any;
    eraseMode: boolean
  }
  

function BetOnRows(props:RowsProps) {
    const {slots , setData, valueChip , eraseMode} = props
    return (
        <>
            <button className='w-[50px] h-[70px] border border-solid border-white text-center'>1st</button>
            <button className='w-[50px] h-[70px] border border-solid border-white'>2st</button>
            <button className='w-[50px] h-[70px] border border-solid border-white'>3st</button>
        </>
    )
}

export default BetOnRows
