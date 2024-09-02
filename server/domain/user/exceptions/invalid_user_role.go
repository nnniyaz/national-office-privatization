package exceptions

import "github.com/nnniyaz/nop/pkg/core"

var ErrInvalidUserRole = core.NewI18NError(core.EINVALID, core.TXT_INVALID_USER_ROLE)
