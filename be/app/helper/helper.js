export const idPhoneNumber = (phoneNumber) => {
    try {
        if(phoneNumber.charAt(0) === "0"){
            return `62${phoneNumber.substring(1, phoneNumber.length)}`
        }else{
            return phoneNumber
        }
    } catch (error) {
        console.log(error)
        return phoneNumber
    }
}