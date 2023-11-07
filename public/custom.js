import toast from "react-hot-toast";

function isInputNumber(evt) {

    var ch = String.fromCharCode(evt.which);

    if (!(/[0-9]/.test(ch))) {
        toast.error("Please enter only number");
    }

}