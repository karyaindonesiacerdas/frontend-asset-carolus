export const RadioButton = (props) => {
    return (
        <button {...props} type="button" onClick={props.onPress} className="flex border w-5 h-5 justify-center items-center border-black  rounded-xl" >
            {
                props.value == true && <div className="h-2.5 w-2.5 bg-primary-600 rounded-xl" />
            }
        </button>
    )
}