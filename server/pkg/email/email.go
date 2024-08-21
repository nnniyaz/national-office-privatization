package email

import (
	"github/nnniyaz/nop/config"
)

type Email interface {
	SendMail(to []string, subject string, htmlBody string) error
}

type email struct {
	dialer *gomail.Dialer
}

func New(cfg *config.CfgEmail) (Email, error) {
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
