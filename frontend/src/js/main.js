// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

// Supports weights 100-900
import '@fontsource/noto-sans-jp';

import { Get_nikki, Get_nikki_count, Get_setting, Set_nikki, Set_setting, Select_Nikki_dir_Dialog } from '../../wailsjs/go/main/App.js'

let Nikki_data = []
let Setting_data = {}
let Nikki_index = 0

function Update_nikki_front(data) {
    document.getElementById("Nikki-Title").innerText = data.Fname;
    document.getElementById("Nikki-Content").value = data.Content;
}

let Nikki_move_index = 0;
function Nikki_move_prev() {
    Nikki_move_index++;
    if (Nikki_move_index >= Get_nikki_count())
        Nikki_move_index = Get_nikki_count() - 1;
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
    if ((await Get_nikki(Nikki_move_index)).Date.Year == 0) {
        Nikki_move_prev();
        return;
    }
    let target_nikki_date = new Date(
        (await Get_nikki(Nikki_move_index)).Date.Year,
        (await Get_nikki(Nikki_move_index)).Date.Month,
        (await Get_nikki(Nikki_move_index)).Date.Day,
    );
    target_nikki_date.setMonth(target_nikki_date.getMonth() - 1);

    while (
        target_nikki_date < (new Date(
            (await Get_nikki(Nikki_move_index)).Date.Year,
            (await Get_nikki(Nikki_move_index)).Date.Month,
            (await Get_nikki(Nikki_move_index)).Date.Day,
        ))
        && Nikki_move_index < Get_nikki_count() - 1) {
        Nikki_move_index++;
    }
    if (Nikki_move_index >= Get_nikki_count())
        Nikki_move_index = Get_nikki_count() - 1;
}

async function Nikki_move_next_month() {
    Nikki_data
    if ((await Get_nikki(Nikki_move_index)).Date.Year == 0) {
        Nikki_move_next();
        return;
    }
    let target_nikki_date = new Date(
        (await Get_nikki(Nikki_move_index)).Date.Year,
        (await Get_nikki(Nikki_move_index)).Date.Month,
        (await Get_nikki(Nikki_move_index)).Date.Day,
    );
    target_nikki_date.setMonth(target_nikki_date.getMonth() + 1);

    while (
        target_nikki_date > (new Date(
            (await Get_nikki(Nikki_move_index)).Date.Year,
            (await Get_nikki(Nikki_move_index)).Date.Month,
            (await Get_nikki(Nikki_move_index)).Date.Day,
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

async function Update() {
    console.log((await Get_nikki(Nikki_index)).Is_loading);
    console.log((await Get_nikki(Nikki_index)).Is_loading);
    if ((await Get_nikki(Nikki_index)).Is_loading == false) {
        let Nikki_data = (await Get_nikki(Nikki_index));

        Nikki_data.Content = document.getElementById("Nikki-Content").value;
        Set_nikki(Nikki_index, Nikki_data);
        console.log(Nikki_move_index, Nikki_index, Nikki_data);
        if (Nikki_move_index != Nikki_index) {
            Nikki_index = Nikki_move_index
            Update_nikki_front((await Get_nikki(Nikki_move_index)));
        }
    } else {
        console.log("AAA");
        if ((await Get_nikki_count()) > 0) {
            document.getElementById("Nikki-Title").innerText = "Loading...";
            document.getElementById("Nikki-Content").value = "Loading...";
        }
    }


    Setting_data.Nikki_dir = document.getElementById("Nikki_dir").value;
    Setting_data.Fname_format = document.getElementById("Fname_format").value;
    Set_setting(Setting_data);
}

async function Init() {
    /*
    Nikki_data = await Get_nikki();
    if (Nikki_data != null)
        Update_nikki_front(Nikki_data[0]);
    */

    Setting_data = await Get_setting();
    document.getElementById("Nikki_dir").value = Setting_data.Nikki_dir;
    document.getElementById("Fname_format").value = Setting_data.Fname_format;

    while ((await Get_nikki(0)).Is_loading) {
    }
    Update_nikki_front(await Get_nikki(0));

    setInterval(() => {
        Update()
    }, 100);
}

document.addEventListener("DOMContentLoaded", async function () {
    await Init();
    document.getElementById("Nikki_move_prev").onclick = Nikki_move_prev;
    document.getElementById("Nikki_move_next").onclick = Nikki_move_next;
    document.getElementById("Nikki_move_prev_month").onclick = Nikki_move_prev_month;
    document.getElementById("Nikki_move_next_month").onclick = Nikki_move_next_month;
    document.getElementById("Nikki_move_today").onclick = Nikki_move_today;
    document.getElementById("Select_Nikki_dir_button").onclick = Select_Nikki_dir;

});

