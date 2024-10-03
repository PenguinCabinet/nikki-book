package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParse_nikki_file(t *testing.T) {
	app := App{}
	app.Setting_data.Nikki_dir = "test-dir"
	app.Setting_data.Fname_format = "YYYY年MM月DD日.txt"

	assert.EqualExportedValues(t,
		Nikki_t{Fname: "2024年09月19日.txt", Date: Nikki_date_t{Year: 2024, Month: 9, Day: 19}, Content: "Test!"},
		app.Parse_nikki_file("2024年09月19日.txt"))
}
