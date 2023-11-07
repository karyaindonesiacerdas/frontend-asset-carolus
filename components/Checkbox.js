import { IoCheckmarkOutline } from "react-icons/io5";

function Checkbox(props) {
    return (
        <>
            <button {...props} type="button" onClick={props.onPress} className="flex-row border w-5 h-5 border-black justify-center" >
                {
                    props.value == true && <IoCheckmarkOutline />
                }
            </button>
        </>
    )
}

export { Checkbox };