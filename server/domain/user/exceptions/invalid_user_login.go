package exceptions

import "github.com/nnniyaz/nop/server/pkg/core"

var ErrInvalidUserLogin = core.NewI18NError(core.EINVALID, core.TXT_INVALID_USER_LOGIN)
