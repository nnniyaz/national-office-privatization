package email

import (
	"fmt"

	"github.com/nnniyaz/nop/server/config"
	"gopkg.in/gomail.v2"
)

type Email interface {
	SendMail(to []string, subject string, htmlBody string) error
}

type email struct {
	dialer *gomail.Dialer
}

func New(cfg *config.CfgEmail) (Email, error) {
	fmt.Println("SMTP Host:", cfg.GetSmtpHost())
	fmt.Println("SMTP Port:", cfg.GetSmtpPort())
	fmt.Println("SMTP User:", cfg.GetSmtpUser())
	fmt.Println("SMTP Pass:", cfg.GetSmtpPass())
	d := gomail.NewDialer(cfg.GetSmtpHost(), int(cfg.GetSmtpPort()), cfg.GetSmtpUser(), cfg.GetSmtpPass())
	if err := d.DialAndSend(); err != nil {
		return nil, err
	}
	return &email{dialer: d}, nil
}

func (e *email) SendMail(to []string, subject string, htmlBody string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", e.dialer.Username)
	m.SetHeader("To", to...)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", htmlBody)
	return e.dialer.DialAndSend(m)
}
