package exceptions

import "github.com/nnniyaz/nop/server/pkg/core"

var ErrInvalidApplicationPhone = core.NewI18NError(core.EINVALID, core.TXT_INVALID_APPLICATION_PHONE)
var ErrInvalidApplicationEmail = core.NewI18NError(core.EINVALID, core.TXT_INVALID_APPLICATION_EMAIL)
