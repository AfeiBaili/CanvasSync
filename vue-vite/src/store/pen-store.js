import {defineStore} from 'pinia'
import {penT} from "../const/pen-state.js";
import {ref} from "vue";

export const usePenStore = defineStore("penStore", () => {
    const pen = ref({
        color: 0,
        colors: [
            "#ccdde6",
            "#000000",
            "#ffffff",
            "#a151e0",
            "#42b883",
            "#57965c",
            "#39c5bb",
            "#4970c1",
            "#548af7",
            "#7c3f42",
            "#c94f4f",
            "#ce7241",
            "#ce4167",
            "#b3042f",
            "#ffd875",
            "#0ab30d",
            "#20b4e1",
            "#2057e1",
            "#6720e1",
            "#cc50d8",
        ],
        width: 5,
        type: penT,
        isDrawing: false,
        startPointX: 0,
        startPointY: 0,
        endPointX: 0,
        endPointY: 0,
    })
    const record = []
    return {pen, record}
})