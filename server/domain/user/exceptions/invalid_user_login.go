package exceptions

import "github.com/nnniyaz/nop/pkg/core"

var ErrInvalidUserLogin = core.NewI18NError(core.EINVALID, core.TXT_INVALID_USER_LOGIN)
