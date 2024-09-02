package exceptions

import "github.com/nnniyaz/nop/server/pkg/core"

var ErrInvalidEventName = core.NewI18NError(core.EINVALID, core.TXT_INVALID_EVENT_NAME)
