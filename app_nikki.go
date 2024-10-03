package main

import (
	"io/ioutil"
	"os"
	"path"
	"sort"
	"time"
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
