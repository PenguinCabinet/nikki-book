package main

import (
	"context"
	"io/ioutil"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

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
