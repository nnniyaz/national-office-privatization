package exceptions

import "github.com/nnniyaz/nop/server/pkg/core"

var ErrInvalidApplicationContact = core.NewI18NError(core.EINVALID, core.TXT_INVALID_APPLICATION_CONTACT)
