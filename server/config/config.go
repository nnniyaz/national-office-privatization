package config

type Config struct {
	mongoUri      string
	isDevMode     bool
	emailCfg      *CfgEmail
	spaceBucket   string
	spaceKey      string
	spaceSecret   string
	spaceEndPoint string
	spaceRegion   string
}

func New(isDevMode bool, smtpPort int, smtpUser, smtpPass, smtpHost, mongoUri, spaceBucket, spaceKey, spaceSecret, spaceEndPoint, spaceRegion string) *Config {
	return &Config{
		mongoUri:      mongoUri,
		isDevMode:     isDevMode,
		emailCfg:      NewCfgEmail(int64(smtpPort), smtpUser, smtpPass, smtpHost),
		spaceBucket:   spaceBucket,
		spaceKey:      spaceKey,
		spaceSecret:   spaceSecret,
		spaceEndPoint: spaceEndPoint,
		spaceRegion:   spaceRegion,
	}
}

func (c *Config) GetMongoUri() string {
	return c.mongoUri
}

func (c *Config) GetIsDevMode() bool {
	return c.isDevMode
}

func (c *Config) GetEmailCfg() *CfgEmail {
	return c.emailCfg
}

func (c *Config) GetSpaceBucket() string {
	return c.spaceBucket
}

func (c *Config) GetSpaceKey() string {
	return c.spaceKey
}

func (c *Config) GetSpaceSecret() string {
	return c.spaceSecret
}

func (c *Config) GetSpaceEndPoint() string {
	return c.spaceEndPoint
}

func (c *Config) GetSpaceRegion() string {
	return c.spaceRegion
}

type CfgEmail struct {
	smtpUser string
	smtpPass string
	smtpHost string
	smtpPort int64
}

func NewCfgEmail(smtpPort int64, smtpUser, smtpPass, smtpHost string) *CfgEmail {
	return &CfgEmail{
		smtpUser: smtpUser,
		smtpPass: smtpPass,
		smtpHost: smtpHost,
		smtpPort: smtpPort,
	}
}

func (c *CfgEmail) GetSmtpUser() string {
	return c.smtpUser
}

func (c *CfgEmail) GetSmtpPass() string {
	return c.smtpPass
}

func (c *CfgEmail) GetSmtpHost() string {
	return c.smtpHost
}

func (c *CfgEmail) GetSmtpPort() int64 {
	return c.smtpPort
}
