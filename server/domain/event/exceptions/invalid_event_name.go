package exceptions

import "github.com/nnniyaz/nop/pkg/core"

var ErrInvalidEventName = core.NewI18NError(core.EINVALID, core.TXT_INVALID_EVENT_NAME)
