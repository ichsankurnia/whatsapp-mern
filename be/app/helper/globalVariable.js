class GlobalVariable {
    constructor(){
        this.name = ""
        this.handle = ""
    }

    get handle(){
        return this._handle
    }

    set handle(value){
        if(value.length == 0) {
            console.log("Handle can't empty")
            return
       }
        // must use separeted property
        this._handle = value
    }
}

export default GlobalVariable