const correctDate = (params) => {
    var date = ""
    params < 10? date  = "0" + params : date = params
    return date
}

const correctMili = (mili) => {
    if (mili < 10) return "00" + mili
    else if ( mili < 100) return "0" + mili
    else return mili
}

const getTimeStamp = () => {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minit = date.getMinutes()
    var second = date.getSeconds()
    var milisecond = date.getMilliseconds()

    year = year.toString()
    month = correctDate(month)
    day = correctDate(day)
    hour = correctDate(hour)
    minit = correctDate(minit)
    second = correctDate(second)
    milisecond = correctMili(milisecond)

    // var datetime = year + "/" + month + "/" + day + " " + hour + ":" + minit + ":" + second + "," + milisecond
    var timestamp = year.substring(year.length - 2, year.length) + month + day + hour + minit + second + milisecond

    return timestamp
}

// const generateDate = () => {
//     var date = new Date()
//     var year = date.getFullYear()
//     var month = date.getMonth() + 1
//     var day = date.getDate()

//     year = year.toString()
//     month = correctDate(month)
//     day = correctDate(day)

//     return (`${year}${month}${day} ${generateTIme()}`)
// // }

// const generateTIme = () => {
//     var date = new Date()
//     var hour = date.getHours()
//     var minit = date.getMinutes()
//     var second = date.getSeconds()

//     hour = correctDate(hour)
//     minit = correctDate(minit)
//     second = correctDate(second)

//     return (hour+":"+minit+":"+second)
// }

export const generateConversationID = (phoneNumber) => {
    const randomNumber = Math.floor((Math.random() * 100000) + 1).toString()

    let lastPhoneNumber = phoneNumber.substring(phoneNumber.length - 5, phoneNumber.length)
    let convID = getTimeStamp() + lastPhoneNumber + randomNumber
    return convID
}