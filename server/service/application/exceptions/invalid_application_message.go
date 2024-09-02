package exceptions

import "github.com/nnniyaz/nop/server/pkg/core"

var ErrInvalidApplicationMessage = core.NewI18NError(core.EINVALID, core.TXT_INVALID_APPLICATION_MESSAGE)
