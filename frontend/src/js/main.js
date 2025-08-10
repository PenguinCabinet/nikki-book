// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

// Supports weights 100-900
import '@fontsource/noto-sans-jp';

import { Get_nikki, Get_setting, Set_nikki, Set_setting, Select_Nikki_dir_Dialog } from '../../wailsjs/go/main/App.js'

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

function Update_nikki_front(data) {
    const day = day_string_arr[
        new Date(
            data.Date.Year,
            data.Date.Month - 1,
            data.Date.Day,
        ).getDay()
    ];

    document.getElementById("Nikki-Title").innerText =
        `${data.Fname} ${day}`
        ;

    document.getElementById("Nikki-Content").value = data.Content;
}

let Nikki_move_index = 0;
function Nikki_move_prev() {
    Nikki_move_index++;
    if (Nikki_move_index >= Nikki_data.length)
        Nikki_move_index = Nikki_data.length - 1;
}
function Nikki_move_next() {
    Nikki_move_index--;
    if (Nikki_move_index < 0)
        Nikki_move_index = 0;
}
function Nikki_move_today() {
    Nikki_move_index = 0;
}
function Nikki_move_prev_month() {
    if (Nikki_data[Nikki_move_index].Date.Year == 0) {
        Nikki_move_prev();
        return;
    }
    let target_nikki_date = new Date(
        Nikki_data[Nikki_move_index].Date.Year,
        Nikki_data[Nikki_move_index].Date.Month,
        Nikki_data[Nikki_move_index].Date.Day,
    );
    target_nikki_date.setMonth(target_nikki_date.getMonth() - 1);

    while (
        target_nikki_date < (new Date(
            Nikki_data[Nikki_move_index].Date.Year,
            Nikki_data[Nikki_move_index].Date.Month,
            Nikki_data[Nikki_move_index].Date.Day,
        ))
        && Nikki_move_index < Nikki_data.length - 1) {
        Nikki_move_index++;
    }
    if (Nikki_move_index >= Nikki_data.length)
        Nikki_move_index = Nikki_data.length - 1;
}

function Nikki_move_next_month() {
    if (Nikki_data[Nikki_move_index].Date.Year == 0) {
        Nikki_move_next();
        return;
    }
    let target_nikki_date = new Date(
        Nikki_data[Nikki_move_index].Date.Year,
        Nikki_data[Nikki_move_index].Date.Month,
        Nikki_data[Nikki_move_index].Date.Day,
    );
    target_nikki_date.setMonth(target_nikki_date.getMonth() + 1);

    while (
        target_nikki_date > (new Date(
            Nikki_data[Nikki_move_index].Date.Year,
            Nikki_data[Nikki_move_index].Date.Month,
            Nikki_data[Nikki_move_index].Date.Day,
        ))
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

function Update() {
    if (Nikki_data != null) {

        Nikki_data[Nikki_index].Content = document.getElementById("Nikki-Content").value;
        Set_nikki(Nikki_data);
        if (Nikki_move_index != Nikki_index) {
            Nikki_index = Nikki_move_index
            Update_nikki_front(Nikki_data[Nikki_index]);
        }
    }


    Setting_data.Nikki_dir = document.getElementById("Nikki_dir").value;
    Setting_data.Fname_format = document.getElementById("Fname_format").value;
    Set_setting(Setting_data);
}

async function Init() {
    Nikki_data = await Get_nikki();
    if (Nikki_data != null)
        Update_nikki_front(Nikki_data[0]);

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

