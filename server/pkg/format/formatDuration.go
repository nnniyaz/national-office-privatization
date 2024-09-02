package format

import (
	"fmt"
	"time"
)

func FormatDuration(d time.Duration) string {
	if d == 0 {
		return "00y00m00d00h00min00s0000ms"
	}

	years := d / (time.Hour * 24 * 365)
	d -= years * (time.Hour * 24 * 365)
	months := d / (time.Hour * 24 * 30)
	d -= months * (time.Hour * 24 * 30)
	days := d / (time.Hour * 24)
	d -= days * (time.Hour * 24)
	hours := d / time.Hour
	d -= hours * time.Hour
	minutes := d / time.Minute
	d -= minutes * time.Minute
	seconds := d / time.Second
	d -= seconds * time.Second
	milliseconds := d / time.Millisecond

	return fmt.Sprintf("%02dy %02dm %02dd %02dh %02dmin %02ds %03dms", years, months, days, hours, minutes, seconds, milliseconds)
}
