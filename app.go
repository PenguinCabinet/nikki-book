package main

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"os"
	"path"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Nikki_date_t struct {
	Year  int
	Month int
	Day   int
}

type Nikki_t struct {
	Fname   string
	Date    Nikki_date_t
	Content string
}

type Setting_t struct {
	Nikki_dir    string
	Fname_format string
}

var default_Setting_data = Setting_t{Nikki_dir: "", Fname_format: "YYYY年MM月DD日.txt"}

// App struct
type App struct {
	ctx               context.Context
	Nikki_data        []Nikki_t
	Setting_data      Setting_t
	setting_json_path string
}

// NewApp creates a new App application struct
func NewApp() *App {
	app := &App{}
	app.Setting_data = default_Setting_data
	exe_path, err := os.Executable()
	if err != nil {
		panic(err)
	}
	app.setting_json_path = path.Join(filepath.Dir(exe_path), "nikki-book-setting.json")

	return app
}

func TimeFormat_conv(v string) string {
	reslut := v
	reslut = strings.Replace(reslut, "YYYY", "2006", 1)
	reslut = strings.Replace(reslut, "MM", "01", 1)
	reslut = strings.Replace(reslut, "DD", "02", 1)
	return reslut
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Get_dir_fnames(dir_name string) []string {
	dir_data, err := ioutil.ReadDir(dir_name)
	if err != nil {
		return []string{}
	}

	var fnames []string
	for _, e := range dir_data {
		fnames = append(fnames, e.Name())
	}

	return fnames
}

func (a *App) Add_nikki_today() {
	if a.Setting_data.Nikki_dir == "" {
		return
	}

	timezone := time.FixedZone("Asia/Tokyo", 9*60*60)
	time_now := time.Now().In(timezone)
	f, err := os.OpenFile(
		path.Join(
			a.Setting_data.Nikki_dir,
			time_now.Format(TimeFormat_conv(a.Setting_data.Fname_format)),
		),
		os.O_WRONLY|os.O_CREATE, 0666,
	)
	if err != nil {
	}
	f.Close()
}

func (a *App) Parse_nikki_file(fname string) Nikki_t {
	content, err := ioutil.ReadFile(path.Join(a.Setting_data.Nikki_dir, fname))
	if err != nil {
		panic(err)
	}

	Fname_format_golang := TimeFormat_conv(a.Setting_data.Fname_format)

	t, err := time.Parse(Fname_format_golang, fname)

	return Nikki_t{
		Fname: fname, Content: string(content),
		Date: Nikki_date_t{
			Year:  t.Year(),
			Month: int(t.Month()),
			Day:   t.Day(),
		},
	}
}

func (a *App) Write_nikki_file(v Nikki_t) {
	var err error
	var f *os.File
	f, err = os.Create(path.Join(a.Setting_data.Nikki_dir, v.Fname))
	for err != nil {
		f, err = os.Create(path.Join(a.Setting_data.Nikki_dir, v.Fname))
		time.Sleep(time.Millisecond * 200)
	}
	defer f.Close()

	_, err = f.Write([]byte(v.Content))
	if err != nil {
		panic(err)
	}
}

func (a *App) Set_nikki(v []Nikki_t) {
	for i, e := range v {
		if a.Nikki_data[i].Content != e.Content {
			a.Nikki_data[i].Content = e.Content
			a.Write_nikki_file(a.Nikki_data[i])
		}
	}

}

func (a *App) Load_nikki() {
	var reslut []Nikki_t
	for _, e := range a.Get_dir_fnames(a.Setting_data.Nikki_dir) {
		reslut = append(reslut, a.Parse_nikki_file(e))
	}

	sort.SliceStable(reslut, func(i, j int) bool {
		if reslut[i].Date.Year != reslut[j].Date.Year {
			return reslut[i].Date.Year > reslut[j].Date.Year
		}
		if reslut[i].Date.Month != reslut[j].Date.Month {
			return reslut[i].Date.Month > reslut[j].Date.Month
		}
		return reslut[i].Date.Day > reslut[j].Date.Day
	})
	a.Nikki_data = reslut
}

func (a *App) Get_nikki() []Nikki_t {

	return a.Nikki_data
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

func (a *App) Get_setting() Setting_t {
	return a.Setting_data
}

func (a *App) Set_setting(v Setting_t) {
	if a.Setting_data != v {
		a.Setting_data = v
		a.Write_setting()
	}
}

func (a *App) Select_Nikki_dir_Dialog() string {
	path_data, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		DefaultDirectory: "",
		Title:            "日記を保存するディレクトリを選択してください",
	})
	if err != nil {
		return ""
	}
	return path_data
}
