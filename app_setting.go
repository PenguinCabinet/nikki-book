package main

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"time"
)

type Setting_t struct {
	Nikki_dir    string
	Fname_format string
}

var default_Setting_data = Setting_t{Nikki_dir: "", Fname_format: "YYYY年MM月DD日.txt"}

func (a *App) Get_setting() Setting_t {
	return a.Setting_data
}

func (a *App) Set_setting(v Setting_t) {
	if a.Setting_data != v {
		a.Setting_data = v
		a.Write_setting()
	}
}

func (a *App) Write_setting() {
	setting_text, err := json.Marshal(a.Setting_data)
	f, err := os.Create(a.setting_json_path)
	for err != nil {
		f, err = os.Create(a.setting_json_path)
		time.Sleep(time.Millisecond * 200)
	}
	defer f.Close()

	_, err = f.Write([]byte(setting_text))
	if err != nil {
		panic(err)
	}
}

func (a *App) Load_setting() {

	setting_text, err := ioutil.ReadFile(a.setting_json_path)
	if err == nil {
		if err := json.Unmarshal(setting_text, &a.Setting_data); err != nil {
			a.Setting_data = default_Setting_data
		}
	} else {
		a.Setting_data = default_Setting_data
	}

}
