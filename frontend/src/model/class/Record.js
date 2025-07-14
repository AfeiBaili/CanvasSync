export default class Record {
    c
    w
    t
    sX
    sY
    eX
    eY
    p
    isS

    constructor(color, width, type, startPointX, startPointY, endPointX, endPointY, isSolid, path = []) {
        this.c = color
        this.w = width
        this.t = type
        this.sX = startPointX
        this.sY = startPointY
        this.eX = endPointX
        this.eY = endPointY
        this.isS = isSolid
        this.p = path
    }
}