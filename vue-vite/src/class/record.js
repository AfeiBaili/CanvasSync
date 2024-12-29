class Record {
    c
    w
    t
    sX
    sY
    eX
    eY
    p


    constructor(color, width, type, startPointX, startPointY, endPointX, endPointY, path = []) {
        this.c = color
        this.w = width
        this.t = type
        this.sX = startPointX
        this.sY = startPointY
        this.eX = endPointX
        this.eY = endPointY
        this.p = path
    }
}

export default Record