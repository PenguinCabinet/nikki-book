// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

// Supports weights 100-900
import '@fontsource/noto-sans-jp';

import { Get_setting, Set_setting, Select_Nikki_dir_Dialog, Get_nikki_length, Get_nikki_by_index, Check_Nikki_null, Set_nikki_by_index, Loading_nikki_by_index } from '../../wailsjs/go/main/App.js'

let Nikki_data = []
let Setting_data = {}
let Nikki_index = 0

const day_string_arr = [
    "(日)",
    "(月)",
    "(火)",
    "(水)",
    "(木)",
    "(金)",
    "(土)",
];

function nikki_to_Date(v) {
    return new Date(
        v.Date.Year,
        v.Date.Month - 1,
        v.Date.Day,
    )
}

function Update_nikki_front(data) {
    const day = day_string_arr[
        nikki_to_Date(data).getDay()
    ];

    document.getElementById("Nikki-Title").innerText =
        `${data.Fname} ${day}`
        ;

    document.getElementById("Nikki-Content").value = data.Content;
}

let Nikki_move_index = 0;
async function Nikki_move_prev() {
    Nikki_move_index++;
    if (Nikki_move_index >= (await Get_nikki_length()))
        Nikki_move_index = (await Get_nikki_length()) - 1;
}
function Nikki_move_next() {
    Nikki_move_index--;
    if (Nikki_move_index < 0)
        Nikki_move_index = 0;
}
function Nikki_move_today() {
    Nikki_move_index = 0;
}

async function Nikki_move_prev_month() {
    if ((await Get_nikki_by_index(Nikki_move_index)).Date.Year == 0) {
        Nikki_move_prev();
        return;
    }
    let target_nikki_date = nikki_to_Date(
        (await Get_nikki_by_index(Nikki_move_index))
    );
    target_nikki_date.setMonth(target_nikki_date.getMonth() - 1);

    while (
        target_nikki_date < nikki_to_Date(
            (await Get_nikki_by_index(Nikki_move_index))
        )
        && Nikki_move_index < (await Get_nikki_length()) - 1
    ) {
        Nikki_move_index++;
    }
    if (Nikki_move_index >= (await Get_nikki_length()))
        Nikki_move_index = (await Get_nikki_length()) - 1;
}

async function Nikki_move_next_month() {
    if ((await Get_nikki_by_index(Nikki_move_index)).Date.Year == 0) {
        Nikki_move_next();
        return;
    }
    let target_nikki_date = nikki_to_Date(
        (await Get_nikki_by_index(Nikki_move_index))
    );
    target_nikki_date.setMonth(target_nikki_date.getMonth() + 1);

    while (
        target_nikki_date > nikki_to_Date(
            (await Get_nikki_by_index(Nikki_move_index))
        )
        && Nikki_move_index > 0) {
        Nikki_move_index--;
    }
    if (Nikki_move_index < 0)
        Nikki_move_index = 0;
}

async function Select_Nikki_dir() {
    const path = await Select_Nikki_dir_Dialog();
    if (path != "")
        document.getElementById("Nikki_dir").value = path;
}

async function Update() {
    if (!(await Check_Nikki_null())) {
        let Nikki_data_temp = await Get_nikki_by_index(Nikki_index);
        if (Nikki_data_temp.Is_loading) {
            Nikki_data_temp.Content = document.getElementById("Nikki-Content").value;
            await Set_nikki_by_index(Nikki_data_temp, Nikki_index);
        }

        if (Nikki_move_index != Nikki_index) {
            Nikki_index = Nikki_move_index
            if (!(await Get_nikki_by_index(Nikki_index)).Is_loading) {
                await Loading_nikki_by_index(Nikki_index)
            }
            Update_nikki_front((await Get_nikki_by_index(Nikki_index)));
        }
    }


    Setting_data.Nikki_dir = document.getElementById("Nikki_dir").value;
    Setting_data.Fname_format = document.getElementById("Fname_format").value;
    Set_setting(Setting_data);
}

async function Init() {
    if (!(await Check_Nikki_null())) {
        await Loading_nikki_by_index(Nikki_index)
        Update_nikki_front((await Get_nikki_by_index(Nikki_index)));
    }

    Setting_data = await Get_setting();
    document.getElementById("Nikki_dir").value = Setting_data.Nikki_dir;
    document.getElementById("Fname_format").value = Setting_data.Fname_format;

    setInterval(() => {
        Update()
    }, 100);
}

document.addEventListener("DOMContentLoaded", function () {
    Init();
    document.getElementById("Nikki_move_prev").onclick = Nikki_move_prev;
    document.getElementById("Nikki_move_next").onclick = Nikki_move_next;
    document.getElementById("Nikki_move_prev_month").onclick = Nikki_move_prev_month;
    document.getElementById("Nikki_move_next_month").onclick = Nikki_move_next_month;
    document.getElementById("Nikki_move_today").onclick = Nikki_move_today;
    document.getElementById("Select_Nikki_dir_button").onclick = Select_Nikki_dir;

});

