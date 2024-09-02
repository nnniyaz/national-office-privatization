package exceptions

import "github.com/nnniyaz/nop/pkg/core"

var ErrUserNotFound = core.NewI18NError(core.EINVALID, core.TXT_USER_NOT_FOUND)
