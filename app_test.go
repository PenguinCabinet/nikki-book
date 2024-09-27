package main

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestGet_dir_files(t *testing.T) {
	app := App{}
	assert.Equal(t, []string{"2024年09月18日.txt", "2024年09月19日.txt"}, app.Get_dir_fnames("test-dir"))
}

func TestTimeFormat_conv(t *testing.T) {
	time1, err := time.Parse("2006-01-02", "2024-09-19")
	assert.NoError(t, err)
	assert.Equal(t, 2024, time1.Year())
	assert.Equal(t, 9, int(time1.Month()))
	assert.Equal(t, 19, time1.Day())

	time2, err := time.Parse("2006年01月02日", "2024年09月19日")
	assert.NoError(t, err)
	assert.Equal(t, 2024, time2.Year())
	assert.Equal(t, 9, int(time2.Month()))
	assert.Equal(t, 19, time2.Day())

	assert.Equal(t, "2006年01月02日.txt", TimeFormat_conv("YYYY年MM月DD日.txt"))
}

func TestParse_nikki_file(t *testing.T) {
	app := App{}
	app.Setting_data.Nikki_dir = "test-dir"
	app.Setting_data.Fname_format = "YYYY年MM月DD日.txt"

	assert.EqualExportedValues(t,
		Nikki_t{Fname: "2024年09月19日.txt", Date: Nikki_date_t{Year: 2024, Month: 9, Day: 19}, Content: "Test!"},
		app.Parse_nikki_file("2024年09月19日.txt"))
}
